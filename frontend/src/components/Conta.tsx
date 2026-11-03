import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { JOGOS } from '../data/jogos'
import { useStore } from '../store/useStore'
import { ErroApi, alterar, buscar, type Metodo, type Pedido, type Usuario } from '../utils/api'
import { brl } from '../utils/format'
import { SENHA_MINIMA, emailValido } from '../utils/validacao'
import Avatar from './Avatar'
import { DragonMascot } from './Dragon'
import { Campo, Enviar } from './Form'
import GameCover from './GameCover'
import Icon from './Icon'
import Logo from './Logo'
import './Conta.css'

const METODO: Record<Metodo, string> = { cartao: 'Cartão de crédito', pix: 'Pix', boleto: 'Boleto' }
const dataLocal = (iso: string) => new Date(iso).toLocaleDateString('pt-BR')
const mensagemDe = (erro: unknown) => (erro instanceof Error ? erro.message : 'Algo deu errado. Tente novamente.')

// Tela Minha conta (#conta): troca de e-mail e senha e histórico de jogos comprados
function Conta() {
  const { usuario } = useStore()

  if (!usuario) {
    return (
      <Moldura>
        <div className="conta-vazia glass">
          <DragonMascot size={110} />
          <strong>Entre para ver sua conta</strong>
          <p>Faça login para alterar seus dados e acompanhar os jogos que você comprou.</p>
          <a href="#entrar" className="btn btn-primary">
            Entrar <Icon name="arrowRight" size={16} />
          </a>
        </div>
      </Moldura>
    )
  }

  return (
    <Moldura>
      <section className="conta-perfil glass">
        <Avatar nome={usuario.gamertag} size={72} />
        <div>
          <span className="section-kicker">Minha conta</span>
          <h1>{usuario.gamertag}</h1>
          <p>
            {usuario.titulo} · Membro desde {new Date(usuario.criadoEm).getFullYear()}
          </p>
        </div>
      </section>

      <div className="conta-grid">
        <div className="conta-col">
          <AlterarEmail usuario={usuario} />
          <AlterarSenha usuario={usuario} />
        </div>
        <MeusJogos usuarioId={usuario.id} />
      </div>
    </Moldura>
  )
}

function Moldura({ children }: { children: ReactNode }) {
  return (
    <div className="conta container">
      <header className="conta-top">
        <Logo />
        <a href="#topo" className="conta-back">
          <Icon name="chevronLeft" size={16} /> Voltar à loja
        </a>
      </header>
      {children}
    </div>
  )
}

function Ok({ children }: { children: ReactNode }) {
  return (
    <small className="conta-ok" role="status">
      <Icon name="check" size={14} /> {children}
    </small>
  )
}

type ErrosEmail = { email?: string; senhaAtual?: string; geral?: string }

function AlterarEmail({ usuario }: { usuario: Usuario }) {
  const { atualizarUsuario } = useStore()
  const [email, setEmail] = useState(usuario.email)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [erros, setErros] = useState<ErrosEmail>({})
  const [enviando, setEnviando] = useState(false)
  const [ok, setOk] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setOk(false)
    const novos: ErrosEmail = {}
    if (!emailValido(email)) novos.email = 'Informe um e-mail válido.'
    else if (email.trim().toLowerCase() === usuario.email) novos.email = 'Este já é o seu e-mail atual.'
    if (!senhaAtual) novos.senhaAtual = 'Informe sua senha atual.'
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    try {
      atualizarUsuario(await alterar<Usuario>(`/api/usuarios/${usuario.id}/email`, { email, senhaAtual }))
      setSenhaAtual('')
      setOk(true)
    } catch (erro) {
      const status = erro instanceof ErroApi ? erro.status : 0
      const mensagem = mensagemDe(erro)
      setErros(status === 401 ? { senhaAtual: mensagem } : status === 409 ? { email: mensagem } : { geral: mensagem })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="conta-card glass">
      <h2>
        <Icon name="mail" size={18} /> Alterar e-mail
      </h2>
      <form className="conta-form" onSubmit={enviar} noValidate>
        <Campo
          rotulo="Novo e-mail"
          icone="mail"
          tipo="email"
          valor={email}
          aoMudar={setEmail}
          erro={erros.email}
          placeholder="voce@exemplo.com"
          autoComplete="email"
        />
        <Campo
          rotulo="Senha atual"
          icone="lock"
          tipo="password"
          valor={senhaAtual}
          aoMudar={setSenhaAtual}
          erro={erros.senhaAtual}
          placeholder="Para confirmar que é você"
          autoComplete="current-password"
        />
        {erros.geral && (
          <small className="form-error" role="alert">
            {erros.geral}
          </small>
        )}
        {ok && <Ok>E-mail atualizado para {usuario.email}.</Ok>}
        <Enviar enviando={enviando} rotulo="Salvar e-mail" carregando="Salvando..." />
      </form>
    </section>
  )
}

type ErrosSenha = { senhaAtual?: string; novaSenha?: string; confirmacao?: string; geral?: string }

function AlterarSenha({ usuario }: { usuario: Usuario }) {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erros, setErros] = useState<ErrosSenha>({})
  const [enviando, setEnviando] = useState(false)
  const [ok, setOk] = useState(false)

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setOk(false)
    const novos: ErrosSenha = {}
    if (!senhaAtual) novos.senhaAtual = 'Informe sua senha atual.'
    if (novaSenha.length < SENHA_MINIMA) novos.novaSenha = `Use pelo menos ${SENHA_MINIMA} caracteres.`
    else if (novaSenha === senhaAtual) novos.novaSenha = 'A nova senha deve ser diferente da atual.'
    if (confirmacao !== novaSenha) novos.confirmacao = 'As senhas não coincidem.'
    setErros(novos)
    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    try {
      await alterar(`/api/usuarios/${usuario.id}/senha`, { senhaAtual, novaSenha })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmacao('')
      setOk(true)
    } catch (erro) {
      const mensagem = mensagemDe(erro)
      setErros(erro instanceof ErroApi && erro.status === 401 ? { senhaAtual: mensagem } : { geral: mensagem })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="conta-card glass">
      <h2>
        <Icon name="lock" size={18} /> Alterar senha
      </h2>
      <form className="conta-form" onSubmit={enviar} noValidate>
        <Campo
          rotulo="Senha atual"
          icone="lock"
          tipo="password"
          valor={senhaAtual}
          aoMudar={setSenhaAtual}
          erro={erros.senhaAtual}
          placeholder="Sua senha de hoje"
          autoComplete="current-password"
        />
        <Campo
          rotulo="Nova senha"
          icone="lock"
          tipo="password"
          valor={novaSenha}
          aoMudar={setNovaSenha}
          erro={erros.novaSenha}
          placeholder={`Mín. ${SENHA_MINIMA} caracteres`}
          autoComplete="new-password"
        />
        <Campo
          rotulo="Confirmar nova senha"
          icone="lock"
          tipo="password"
          valor={confirmacao}
          aoMudar={setConfirmacao}
          erro={erros.confirmacao}
          placeholder="Repita a nova senha"
          autoComplete="new-password"
        />
        {erros.geral && (
          <small className="form-error" role="alert">
            {erros.geral}
          </small>
        )}
        {ok && <Ok>Senha alterada. Use a nova senha no próximo login.</Ok>}
        <Enviar enviando={enviando} rotulo="Salvar senha" carregando="Salvando..." />
      </form>
    </section>
  )
}

// Pedidos feitos no Checkout com a conta logada, do mais recente ao mais antigo
function MeusJogos({ usuarioId }: { usuarioId: string }) {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    buscar<Pedido[]>(`/api/pedidos/usuario/${usuarioId}`)
      .then((lista) => ativo && setPedidos(lista))
      .catch((e) => ativo && setErro(mensagemDe(e)))
    return () => {
      ativo = false
    }
  }, [usuarioId])

  const jogos = pedidos?.reduce((s, p) => s + p.itens.length, 0) ?? 0
  const pendentes = pedidos?.filter((p) => p.status === 'pendente').length ?? 0

  return (
    <section className="conta-card conta-jogos glass">
      <h2>
        <Icon name="gamepad" size={18} /> Meus jogos
        {pedidos && pedidos.length > 0 && (
          <small>
            {jogos} jogo(s) · {pendentes > 0 ? `${pendentes} pedido(s) aguardando pagamento` : 'tudo pago'}
          </small>
        )}
      </h2>

      {erro ? (
        <small className="form-error" role="alert">
          {erro}
        </small>
      ) : !pedidos ? (
        <p className="conta-info">
          <span className="form-spinner" /> Carregando seus pedidos...
        </p>
      ) : pedidos.length === 0 ? (
        <div className="conta-sem-pedidos">
          <p>Você ainda não comprou nenhum jogo.</p>
          <a href="#em-alta" className="btn btn-primary">
            Explorar a loja <Icon name="arrowRight" size={16} />
          </a>
        </div>
      ) : (
        <ul className="conta-pedidos">
          {pedidos.map((p) => (
            <li key={p.id} className="conta-pedido">
              <header>
                <div>
                  <strong>Pedido #{p.numero}</strong>
                  <small>
                    {dataLocal(p.criadoEm)} · {METODO[p.metodo]}
                  </small>
                </div>
                <span className={`conta-status conta-status-${p.status}`}>
                  <Icon name={p.status === 'pago' ? 'check' : 'clock'} size={13} />
                  {p.status === 'pago' ? 'Pago' : 'Aguardando pagamento'}
                </span>
              </header>
              <ul className="conta-itens">
                {p.itens.map((item) => {
                  const jogo = JOGOS.find((j) => j.id === item.jogoId)
                  return (
                    <li key={item.jogoId}>
                      <span className="conta-thumb">{jogo && <GameCover jogo={jogo} logo={false} />}</span>
                      <span className="conta-item-titulo">{item.titulo}</span>
                      <span>{brl(item.preco)}</span>
                    </li>
                  )
                })}
              </ul>
              <footer>
                <span>{p.status === 'pago' ? `Pago em ${dataLocal(p.pagoEm ?? p.criadoEm)}` : 'Liberado após a compensação do boleto'}</span>
                <strong>{brl(p.total)}</strong>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Conta
