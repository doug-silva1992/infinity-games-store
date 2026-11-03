import type { ReactNode } from 'react'
import { JOGOS } from '../data/jogos'
import { numero } from '../utils/format'
import { DragonMascot } from './Dragon'
import GameCover from './GameCover'
import Icon, { type IconName } from './Icon'
import Logo from './Logo'
import './AuthPage.css'

// Capas em destaque no painel lateral
const VITRINE = [...JOGOS].sort((a, b) => b.tendencia - a.tendencia).slice(0, 3)

const VANTAGENS: { icone: IconName; texto: string }[] = [
  { icone: 'trophy', texto: 'Conquistas e XP a cada compra' },
  { icone: 'flame', texto: 'Recomendações do Ignis para o seu perfil' },
  { icone: 'bolt', texto: 'Alertas de promoção da sua lista de desejos' },
]

type Props = {
  kicker: string
  titulo: string
  sub: string
  rodape: ReactNode
  children: ReactNode
}

// Moldura das telas de entrar e registrar: vitrine à esquerda, formulário à direita
function AuthPage({ kicker, titulo, sub, rodape, children }: Props) {
  return (
    <main className="auth">
      <section className="auth-showcase" aria-hidden="true">
        <div className="auth-covers">
          {VITRINE.map((jogo) => (
            <div key={jogo.id} className="auth-cover">
              <GameCover jogo={jogo} />
            </div>
          ))}
        </div>
        <div className="auth-pitch">
          <DragonMascot size={84} className="auth-dragon" />
          <h2>
            Seu universo de jogos <span className="text-grad">não tem fim.</span>
          </h2>
          <ul>
            {VANTAGENS.map((v) => (
              <li key={v.texto}>
                <Icon name={v.icone} size={16} />
                {v.texto}
              </li>
            ))}
          </ul>
          <small>{numero(JOGOS.length)} jogos com entrega digital imediata</small>
        </div>
      </section>

      <section className="auth-panel glass">
        <div className="auth-top">
          <Logo />
          <a href="#topo" className="auth-back">
            <Icon name="chevronLeft" size={16} /> Voltar à loja
          </a>
        </div>
        <div className="auth-head">
          <span className="section-kicker">{kicker}</span>
          <h1>{titulo}</h1>
          <p>{sub}</p>
        </div>
        {children}
        <p className="auth-foot">{rodape}</p>
      </section>
    </main>
  )
}

// Mensagem exibida após o envio bem-sucedido, com o próximo passo
type SucessoProps = { titulo: string; texto: string; href?: string; acao?: string }

export function Sucesso({ titulo, texto, href = '#topo', acao = 'Ir para a loja' }: SucessoProps) {
  return (
    <div className="auth-success" role="status">
      <span className="auth-success-icon">
        <Icon name="check" size={26} />
      </span>
      <strong>{titulo}</strong>
      <p>{texto}</p>
      <a href={href} className="btn btn-primary form-submit">
        {acao} <Icon name="arrowRight" size={18} />
      </a>
    </div>
  )
}

export default AuthPage
