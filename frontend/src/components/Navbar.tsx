import { useEffect, useState } from 'react'
import { CONQUISTAS, JOGADOR, XP_POR_NIVEL } from '../data/perfil'
import { useClickOutside } from '../hooks/useClickOutside'
import { useStore } from '../store/useStore'
import { numero } from '../utils/format'
import Avatar from './Avatar'
import Icon from './Icon'
import Logo from './Logo'
import SearchBox from './SearchBox'
import './Navbar.css'

const LINKS = [
  { href: '#em-alta', rotulo: 'Loja' },
  { href: '#promocoes', rotulo: 'Promoções' },
  { href: '#indie', rotulo: 'Indie' },
  { href: '#central', rotulo: 'Comunidade' },
]

function Notificacoes() {
  const { notificacoes, marcarNotificacoesLidas } = useStore()
  const [aberto, setAberto] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(aberto, () => setAberto(false))
  const naoLidas = notificacoes.filter((n) => !n.lida).length

  return (
    <div className="nav-pop" ref={ref}>
      <button
        className={`nav-icon ${aberto ? 'on' : ''}`}
        onClick={() => setAberto(!aberto)}
        aria-label={`Notificações (${naoLidas} não lidas)`}
        aria-expanded={aberto}
      >
        <Icon name="bell" size={19} />
        {naoLidas > 0 && <span className="nav-badge nav-badge-alert">{naoLidas}</span>}
      </button>
      {aberto && (
        <div className="nav-menu nav-menu-notif glass">
          <div className="nav-menu-head">
            <strong>Notificações</strong>
            {naoLidas > 0 && <button onClick={marcarNotificacoesLidas}>Marcar como lidas</button>}
          </div>
          <ul className="notif-list">
            {notificacoes.map((n) => (
              <li key={n.id} className={n.lida ? '' : 'unread'}>
                <span className="notif-icon">
                  <Icon name={n.icone} size={16} />
                </span>
                <span className="notif-text">
                  <strong>{n.titulo}</strong>
                  <span>{n.texto}</span>
                  <small>{n.tempo}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Perfil() {
  const { nivel, xpNoNivel, xp, conquistas, biblioteca, desejos } = useStore()
  const [aberto, setAberto] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(aberto, () => setAberto(false))
  const progresso = xpNoNivel / XP_POR_NIVEL
  const fechar = () => setAberto(false)

  return (
    <div className="nav-pop" ref={ref}>
      <button className="nav-profile" onClick={() => setAberto(!aberto)} aria-expanded={aberto} aria-label="Perfil gamer">
        <Avatar nome={JOGADOR.gamertag} size={40} progresso={progresso} dragao />
        <span className="nav-profile-info">
          <strong>{JOGADOR.gamertag}</strong>
          <small>Nível {nivel}</small>
        </span>
        <Icon name="chevronDown" size={16} className="nav-profile-caret" />
      </button>
      {aberto && (
        <div className="nav-menu nav-menu-profile glass">
          <div className="profile-card">
            <Avatar nome={JOGADOR.gamertag} size={64} progresso={progresso} dragao />
            <div>
              <strong>{JOGADOR.gamertag}</strong>
              <span>{JOGADOR.titulo}</span>
            </div>
            <span className="profile-level">{nivel}</span>
          </div>
          <div className="profile-xp">
            <div className="profile-xp-bar">
              <span style={{ width: `${progresso * 100}%` }} />
            </div>
            <small>
              {numero(xpNoNivel)} / {numero(XP_POR_NIVEL)} XP para o nível {nivel + 1} · {numero(xp)} XP total
            </small>
          </div>
          <div className="profile-stats">
            <span>
              <strong>{biblioteca.size}</strong> jogos
            </span>
            <span>
              <strong>
                {conquistas.size}/{CONQUISTAS.length}
              </strong>{' '}
              conquistas
            </span>
            <span>
              <strong>{desejos.size}</strong> desejos
            </span>
          </div>
          <nav className="profile-links">
            <a href="#central" onClick={fechar}>
              <Icon name="user" size={16} /> Perfil gamer
            </a>
            <a href="#conquistas" onClick={fechar}>
              <Icon name="trophy" size={16} /> Conquistas
            </a>
            <a href="#ranking" onClick={fechar}>
              <Icon name="trendingUp" size={16} /> Ranking da comunidade
            </a>
            <a href="#desejos" onClick={fechar}>
              <Icon name="heart" size={16} /> Lista de desejos
            </a>
          </nav>
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const { carrinho, desejos, setCarrinhoAberto } = useStore()
  const [rolou, setRolou] = useState(false)

  useEffect(() => {
    const onScroll = () => setRolou(scrollY > 12)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${rolou ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Logo />
        <nav className="nav-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.rotulo}
            </a>
          ))}
        </nav>
        <SearchBox />
        <div className="nav-actions">
          <a href="#desejos" className="nav-icon nav-wish" aria-label={`Lista de desejos (${desejos.size})`}>
            <Icon name="heart" size={19} />
            {desejos.size > 0 && <span className="nav-badge">{desejos.size}</span>}
          </a>
          <Notificacoes />
          <button className="nav-icon" onClick={() => setCarrinhoAberto(true)} aria-label={`Carrinho (${carrinho.length})`}>
            <Icon name="cart" size={19} />
            {carrinho.length > 0 && (
              <span key={carrinho.length} className="nav-badge nav-badge-cart">
                {carrinho.length}
              </span>
            )}
          </button>
          <Perfil />
        </div>
      </div>
    </header>
  )
}

export default Navbar
