import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { Jogo } from '../data/jogos'
import { useStore } from '../store/useStore'
import { postar } from '../utils/api'
import { resumoDoCarrinho } from '../utils/carrinho'
import { brl, desconto, numero } from '../utils/format'
import { emailValido, esperar } from '../utils/validacao'
import { DragonMascot } from './Dragon'
import { Campo, Enviar } from './Form'
import GameCover from './GameCover'
import Icon, { type IconName } from './Icon'
import Logo from './Logo'
import './Checkout.css'

type Metodo = 'cartao' | 'boleto' | 'pix'
type Etapa = 'formulario' | 'aguardando' | 'concluido'
type Pedido = { numero: string; itens: Jogo[]; total: number; xp: number; metodo: Metodo }
type Erros = Partial<Record<'email' | 'numero' | 'nome' | 'validade' | 'cvv' | 'cpf' | 'geral', string>>

const METODOS: { id: Metodo; rotulo: string; icone: IconName; dica: string }[] = [
  { id: 'cartao', rotulo: 'Cartão de crédito', icone: 'creditCard', dica: 'Até 6x sem juros' },
  { id: 'pix', rotulo: 'Pix', icone: 'qrCode', dica: 'Aprovação na hora' },
  { id: 'boleto', rotulo: 'Boleto', icone: 'barcode', dica: 'Até 2 dias úteis' },
]

const PIX_VALIDADE = 10 * 60
const PARCELA_MINIMA = 20

// ---------- Máscaras e validações ----------
const digitos = (v: string) => v.replace(/\D/g, '')
const mascaraCartao = (v: string) => digitos(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
const mascaraValidade = (v: string) => digitos(v).slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2')
const mascaraCpf = (v: string) =>
  digitos(v)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')

function bandeira(numero: string) {
  const n = digitos(numero)
  if (/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(n)) return 'Elo'
  if (/^3[47]/.test(n)) return 'Amex'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard'
  if (/^4/.test(n)) return 'Visa'
  return ''
}

function validadeOk(v: string) {
  const [mes, ano] = v.split('/').map(Number)
  if (!mes || mes > 12 || ano === undefined || v.length !== 5) return false
  const hoje = new Date()
  const fim = new Date(2000 + ano, mes) // primeiro dia do mês seguinte ao vencimento
  return fim > hoje
}

// ---------- Códigos de demonstração (substituir pelos retornos do gateway de pagamento) ----------
function aleatorio(semente: number) {
  let s = semente
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function codigoPix(total: number, pedido: string) {
  const valor = total.toFixed(2)
  return `00020126580014BR.GOV.BCB.PIX0136infinity-games-${pedido}52040000530398654${String(valor.length).padStart(2, '0')}${valor}5802BR5914INFINITY GAMES6009SAO PAULO62070503***6304A1F3`
}

function linhaDigitavel(total: number, pedido: string) {
  const r = aleatorio(Number(pedido))
  const d = (n: number) => Array.from({ length: n }, () => Math.floor(r() * 10)).join('')
  const valor = String(Math.round(total * 100)).padStart(10, '0')
  return `34191.${d(5)} ${d(5)}.${d(6)} ${d(5)}.${d(6)} ${d(1)} ${d(4)}${valor}`
}

// QR visual gerado a partir do código (ilustrativo, não é lido por apps de banco)
function QrCode({ codigo }: { codigo: string }) {
  const TAM = 29
  const modulos = useMemo(() => {
    const r = aleatorio([...codigo].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 4294967296, 7))
    const finder = (x: number, y: number) =>
      [
        [0, 0],
        [TAM - 7, 0],
        [0, TAM - 7],
      ].some(([fx, fy]) => x >= fx - 1 && x <= fx + 7 && y >= fy - 1 && y <= fy + 7)
    const lista: [number, number][] = []
    for (let y = 0; y < TAM; y++) for (let x = 0; x < TAM; x++) if (!finder(x, y) && r() > 0.52) lista.push([x, y])
    return lista
  }, [codigo])

  const olho = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.2} fill="none" stroke="currentColor" strokeWidth={1} />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.6} />
    </g>
  )

  return (
    <svg viewBox={`-2 -2 ${TAM + 4} ${TAM + 4}`} className="pix-qr" role="img" aria-label="QR Code Pix">
      <rect x={-2} y={-2} width={TAM + 4} height={TAM + 4} rx={2} fill="#fff" />
      <g fill="currentColor">
        {modulos.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} />
        ))}
        {olho(0, 0)}
        {olho(TAM - 7, 0)}
        {olho(0, TAM - 7)}
      </g>
    </svg>
  )
}

function Copiar({ texto, rotulo }: { texto: string; rotulo: string }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sem permissão de área de transferência: o código continua visível para copiar à mão
    }
  }

  return (
    <div className="pay-code">
      <code>{texto}</code>
      <button type="button" className="btn btn-ghost btn-sm" onClick={copiar}>
        <Icon name={copiado ? 'check' : 'copy'} size={15} /> {copiado ? 'Copiado!' : rotulo}
      </button>
    </div>
  )
}

function Checkout() {
  const { usuario, carrinho, finalizarCompra } = useStore()
  const { totalCheio, total, economia, xp } = resumoDoCarrinho(carrinho)
  const maxParcelas = Math.max(1, Math.min(6, Math.floor(total / PARCELA_MINIMA)))

  const [metodo, setMetodo] = useState<Metodo>('cartao')
  const [etapa, setEtapa] = useState<Etapa>('formulario')
  const [processando, setProcessando] = useState(false)
  const [erros, setErros] = useState<Erros>({})
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [numeroPedido] = useState(() => String(Math.floor(100000 + Math.random() * 900000)))

  const [email, setEmail] = useState(usuario?.email ?? '')
  const [numeroCartao, setNumeroCartao] = useState('')
  const [nome, setNome] = useState('')
  const [validade, setValidade] = useState('')
  const [cvv, setCvv] = useState('')
  const [parcelas, setParcelas] = useState(1)
  const [cpf, setCpf] = useState('')
  const [restante, setRestante] = useState(PIX_VALIDADE)

  // Contagem regressiva do Pix enquanto o QR Code está na tela
  const contando = etapa === 'aguardando' && metodo === 'pix'
  useEffect(() => {
    if (!contando) return
    const timer = setInterval(() => setRestante((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [contando])

  const trocarMetodo = (m: Metodo) => {
    if (processando) return
    setMetodo(m)
    setEtapa('formulario')
    setErros({})
  }

  const validar = () => {
    const novos: Erros = {}
    if (!emailValido(email)) novos.email = 'Informe um e-mail válido para receber os jogos.'
    if (metodo === 'cartao') {
      if (digitos(numeroCartao).length < 16) novos.numero = 'Número do cartão incompleto.'
      if (nome.trim().length < 3) novos.nome = 'Digite o nome como está no cartão.'
      if (!validadeOk(validade)) novos.validade = 'Validade inválida.'
      if (cvv.length < 3) novos.cvv = 'CVV inválido.'
    }
    if (metodo === 'boleto' && digitos(cpf).length !== 11) novos.cpf = 'CPF deve ter 11 dígitos.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  // Logado, o pedido fica salvo na conta (tela Minha conta); visitante só recebe por e-mail
  const concluir = async () => {
    if (usuario) {
      const itens = carrinho.map((j) => ({ jogoId: j.id, titulo: j.titulo, preco: j.preco }))
      try {
        await postar('/api/pedidos', { usuarioId: usuario.id, numero: numeroPedido, metodo, itens })
      } catch (erro) {
        setErros({ geral: erro instanceof Error ? erro.message : 'Não foi possível registrar o pedido.' })
        return
      }
    }
    setPedido({ numero: numeroPedido, itens: carrinho, total, xp, metodo })
    finalizarCompra()
    setEtapa('concluido')
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (processando || !validar()) return
    setProcessando(true)
    await esperar(metodo === 'cartao' ? 1600 : 900)
    if (metodo === 'cartao') await concluir()
    setProcessando(false)
    if (metodo !== 'cartao') {
      setRestante(PIX_VALIDADE)
      setEtapa('aguardando')
    }
  }

  const confirmarPagamento = async () => {
    setProcessando(true)
    setErros({})
    await esperar(1200)
    await concluir()
    setProcessando(false)
  }

  if (etapa === 'concluido' && pedido) return <Concluido pedido={pedido} email={email} />

  if (carrinho.length === 0) {
    return (
      <Moldura>
        <div className="pay-empty glass">
          <DragonMascot size={110} />
          <strong>Nada para pagar por aqui</strong>
          <p>Seu carrinho está vazio. Escolha alguns jogos e volte para finalizar a compra.</p>
          <a href="#topo" className="btn btn-primary">
            Explorar a loja <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </Moldura>
    )
  }

  const valorParcela = total / parcelas
  const mmss = `${String(Math.floor(restante / 60)).padStart(2, '0')}:${String(restante % 60).padStart(2, '0')}`

  return (
    <Moldura>
      <div className="pay">
        <form className="pay-main glass" onSubmit={enviar} noValidate>
          <div className="pay-head">
            <span className="section-kicker">Pagamento</span>
            <h1>Finalizar compra</h1>
          </div>

          <Campo
            rotulo="E-mail para receber os jogos"
            icone="mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            erro={erros.email}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            disabled={etapa === 'aguardando'}
          />

          <div className="pay-methods" role="radiogroup" aria-label="Forma de pagamento">
            {METODOS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={metodo === m.id}
                className={`pay-method ${metodo === m.id ? 'on' : ''}`}
                onClick={() => trocarMetodo(m.id)}
              >
                <Icon name={m.icone} size={22} />
                <strong>{m.rotulo}</strong>
                <small>{m.dica}</small>
              </button>
            ))}
          </div>

          {metodo === 'cartao' && (
            <div className="pay-panel" key="cartao">
              <div className="card-preview" aria-hidden="true">
                <div className="card-preview-top">
                  <span className="card-chip" />
                  <strong>{bandeira(numeroCartao)}</strong>
                </div>
                <span className="card-number">{(numeroCartao || '•••• •••• •••• ••••').padEnd(19, '•')}</span>
                <div className="card-preview-bottom">
                  <span>
                    <small>Titular</small>
                    {nome.trim().toUpperCase() || 'NOME NO CARTÃO'}
                  </span>
                  <span>
                    <small>Validade</small>
                    {validade || 'MM/AA'}
                  </span>
                </div>
              </div>

              <div className="pay-fields">
                <Campo
                  rotulo="Número do cartão"
                  icone="creditCard"
                  tipo="tel"
                  inputMode="numeric"
                  valor={numeroCartao}
                  aoMudar={(v) => setNumeroCartao(mascaraCartao(v))}
                  erro={erros.numero}
                  placeholder="0000 0000 0000 0000"
                  autoComplete="cc-number"
                />
                <Campo
                  rotulo="Nome no cartão"
                  icone="user"
                  valor={nome}
                  aoMudar={setNome}
                  erro={erros.nome}
                  placeholder="Como está impresso"
                  autoComplete="cc-name"
                />
                <div className="pay-pair">
                  <Campo
                    rotulo="Validade"
                    icone="clock"
                    tipo="tel"
                    inputMode="numeric"
                    valor={validade}
                    aoMudar={(v) => setValidade(mascaraValidade(v))}
                    erro={erros.validade}
                    placeholder="MM/AA"
                    autoComplete="cc-exp"
                  />
                  <Campo
                    rotulo="CVV"
                    icone="lock"
                    tipo="password"
                    inputMode="numeric"
                    valor={cvv}
                    aoMudar={(v) => setCvv(digitos(v).slice(0, 4))}
                    erro={erros.cvv}
                    placeholder="123"
                    autoComplete="cc-csc"
                  />
                </div>
                <label className="form-field">
                  <span>Parcelas</span>
                  <select className="pay-select" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>
                    {Array.from({ length: maxParcelas }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}x de {brl(total / n)} sem juros
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <Enviar
                enviando={processando}
                rotulo={parcelas > 1 ? `Pagar ${parcelas}x de ${brl(valorParcela)}` : `Pagar ${brl(total)}`}
                carregando="Processando pagamento..."
              />
            </div>
          )}

          {metodo === 'pix' && (
            <div className="pay-panel" key="pix">
              {etapa === 'formulario' ? (
                <>
                  <ul className="pay-steps">
                    <li>Gere o QR Code e abra o app do seu banco.</li>
                    <li>Escolha pagar com Pix e escaneie o código ou use o copia e cola.</li>
                    <li>Os jogos entram na sua biblioteca assim que o pagamento é aprovado.</li>
                  </ul>
                  <Enviar enviando={processando} rotulo={`Gerar Pix de ${brl(total)}`} carregando="Gerando código..." />
                </>
              ) : (
                <div className="pix">
                  <QrCode codigo={codigoPix(total, numeroPedido)} />
                  <div className="pix-info">
                    <span className={`pix-timer ${restante === 0 ? 'expired' : ''}`}>
                      <Icon name="clock" size={15} />
                      {restante > 0 ? `Expira em ${mmss}` : 'Código expirado'}
                    </span>
                    <strong>{brl(total)}</strong>
                    <p>Escaneie o QR Code com o app do seu banco ou copie o código abaixo.</p>
                  </div>
                  <Copiar texto={codigoPix(total, numeroPedido)} rotulo="Copiar código" />
                  {restante > 0 ? (
                    <button type="button" className="btn btn-primary form-submit" onClick={confirmarPagamento} disabled={processando}>
                      {processando ? (
                        <>
                          <span className="form-spinner" /> Confirmando pagamento...
                        </>
                      ) : (
                        <>
                          <Icon name="check" size={18} /> Já fiz o pagamento
                        </>
                      )}
                    </button>
                  ) : (
                    <button type="button" className="btn btn-ghost form-submit" onClick={() => setRestante(PIX_VALIDADE)}>
                      Gerar novo código
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {metodo === 'boleto' && (
            <div className="pay-panel" key="boleto">
              {etapa === 'formulario' ? (
                <>
                  <Campo
                    rotulo="CPF do pagador"
                    icone="user"
                    tipo="tel"
                    inputMode="numeric"
                    valor={cpf}
                    aoMudar={(v) => setCpf(mascaraCpf(v))}
                    erro={erros.cpf}
                    placeholder="000.000.000-00"
                  />
                  <ul className="pay-steps">
                    <li>O boleto vence em 3 dias úteis.</li>
                    <li>A compensação leva até 2 dias úteis após o pagamento.</li>
                    <li>Os jogos são liberados assim que o pagamento é confirmado.</li>
                  </ul>
                  <Enviar enviando={processando} rotulo={`Gerar boleto de ${brl(total)}`} carregando="Gerando boleto..." />
                </>
              ) : (
                <div className="boleto">
                  <div className="boleto-bars" aria-hidden="true" />
                  <div className="pix-info">
                    <span className="pix-timer">
                      <Icon name="clock" size={15} /> Vence em 3 dias úteis
                    </span>
                    <strong>{brl(total)}</strong>
                    <p>Pague no app do banco, internet banking ou lotérica usando a linha digitável.</p>
                  </div>
                  <Copiar texto={linhaDigitavel(total, numeroPedido)} rotulo="Copiar linha" />
                  <button type="button" className="btn btn-primary form-submit" onClick={confirmarPagamento} disabled={processando}>
                    {processando ? (
                      <>
                        <span className="form-spinner" /> Registrando pedido...
                      </>
                    ) : (
                      <>
                        <Icon name="check" size={18} /> Concluir pedido
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {erros.geral && (
            <small className="form-error" role="alert">
              {erros.geral}
            </small>
          )}
        </form>

        <aside className="pay-summary glass">
          <h2>
            Resumo do pedido <span>#{numeroPedido}</span>
          </h2>
          <ul className="pay-items">
            {carrinho.map((jogo) => (
              <li key={jogo.id}>
                <span className="pay-thumb">
                  <GameCover jogo={jogo} logo={false} />
                </span>
                <span className="pay-item-info">
                  <strong>{jogo.titulo}</strong>
                  <small>{jogo.plataformas.join(', ')}</small>
                </span>
                <span className="pay-item-price">
                  {desconto(jogo) > 0 && <span className="price-old">{brl(jogo.precoAntigo!)}</span>}
                  {brl(jogo.preco)}
                </span>
              </li>
            ))}
          </ul>
          <div className="pay-rows">
            <div>
              <span>Subtotal</span>
              <span>{brl(totalCheio)}</span>
            </div>
            {economia > 0 && (
              <div className="save">
                <span>Descontos</span>
                <span>−{brl(economia)}</span>
              </div>
            )}
            <div>
              <span>Entrega digital</span>
              <span>Imediata</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>{brl(total)}</span>
            </div>
          </div>
          <div className="pay-xp">
            <Icon name="sparkles" size={16} />
            Você vai ganhar <strong>+{numero(xp)} XP</strong> com esta compra
          </div>
          <a href="#topo" className="pay-back">
            <Icon name="chevronLeft" size={16} /> Continuar comprando
          </a>
        </aside>
      </div>
    </Moldura>
  )
}

function Moldura({ children }: { children: ReactNode }) {
  return (
    <div className="checkout container">
      <header className="checkout-top">
        <Logo />
        <span className="checkout-secure">
          <Icon name="lock" size={15} /> Pagamento seguro
        </span>
      </header>
      {children}
    </div>
  )
}

const TEXTO_CONCLUIDO: Record<Metodo, string> = {
  cartao: 'Pagamento aprovado no cartão.',
  pix: 'Pagamento via Pix confirmado.',
  boleto: 'Boleto registrado. Os jogos são liberados após a compensação.',
}

function Concluido({ pedido, email }: { pedido: Pedido; email: string }) {
  return (
    <Moldura>
      <div className="pay-done glass">
        <span className="pay-done-icon">
          <Icon name="check" size={34} />
        </span>
        <span className="section-kicker">Pedido #{pedido.numero}</span>
        <h1>Compra concluída!</h1>
        <p>
          {TEXTO_CONCLUIDO[pedido.metodo]} Enviamos os detalhes para <strong>{email.trim()}</strong>.
        </p>
        <ul className="pay-done-items">
          {pedido.itens.map((jogo) => (
            <li key={jogo.id}>
              <span className="pay-thumb">
                <GameCover jogo={jogo} logo={false} />
              </span>
              <strong>{jogo.titulo}</strong>
              <small>
                <Icon name="check" size={13} /> Na biblioteca
              </small>
            </li>
          ))}
        </ul>
        <div className="pay-xp">
          <Icon name="sparkles" size={16} />
          <span>
            Total de <strong>{brl(pedido.total)}</strong> · <strong>+{numero(pedido.xp)} XP</strong> ganhos
          </span>
        </div>
        <a href="#topo" className="btn btn-primary">
          Voltar à loja <Icon name="arrowRight" size={16} />
        </a>
      </div>
    </Moldura>
  )
}

export default Checkout
