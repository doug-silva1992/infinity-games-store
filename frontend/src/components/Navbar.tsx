import { useEffect, useState, type ReactNode } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { useStore } from '../store/useStore'
import type { Usuario } from '../utils/api'
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

type MenuProps = {
  avatar: ReactNode
  titulo: string
  sub: string
  children: (aberto: boolean, fechar: () => void) => ReactNode
}

// Botão de perfil que abre, ao passar o mouse, um menu suspenso
function MenuPerfil({ avatar, titulo, sub, children }: MenuProps) {
  const [aberto, setAberto] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(aberto, () => setAberto(false))

  return (
    <div
      className={`nav-pop nav-guest ${aberto ? 'open' : ''}`}
      ref={ref}
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
    >
      <button
        className="nav-profile"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-haspopup="menu"
      >
        {avatar}
        <span className="nav-profile-info">
          <strong>{titulo}</strong>
          <small>{sub}</small>
        </span>
        <Icon name="chevronDown" size={16} className="nav-profile-caret" />
      </button>
      <div className="nav-menu nav-menu-guest glass" role="menu" aria-hidden={!aberto}>
        {children(aberto, () => setAberto(false))}
      </div>
    </div>
  )
}

// Ninguém logado: menu com entrar e registrar
function Visitante() {
  return (
    <MenuPerfil
      avatar={
        <span className="nav-guest-avatar">
          <Icon name="user" size={20} />
        </span>
      }
      titulo="Olá, Visitante"
      sub="Entre ou cadastre-se"
    >
      {(aberto, fechar) => (
        <>
          <a href="#entrar" role="menuitem" className="btn btn-primary" tabIndex={aberto ? 0 : -1} onClick={fechar}>
            <Icon name="logIn" size={16} /> Entrar
          </a>
          <a href="#registrar" role="menuitem" className="btn btn-ghost" tabIndex={aberto ? 0 : -1} onClick={fechar}>
            <Icon name="userPlus" size={16} /> Registrar
          </a>
          <p>Crie sua conta para ganhar XP, desbloquear conquistas e salvar sua lista de desejos.</p>
        </>
      )}
    </MenuPerfil>
  )
}

// Jogador logado: avatar, gamertag, acesso à conta e a opção de sair
function Jogador({ usuario }: { usuario: Usuario }) {
  const { sair } = useStore()

  return (
    <MenuPerfil avatar={<Avatar nome={usuario.gamertag} />} titulo={usuario.gamertag} sub={usuario.titulo}>
      {(aberto, fechar) => (
        <>
          <p>{usuario.email}</p>
          <a href="#conta" role="menuitem" className="btn btn-primary" tabIndex={aberto ? 0 : -1} onClick={fechar}>
            <Icon name="user" size={16} /> Minha conta
          </a>
          <button
            role="menuitem"
            className="btn btn-ghost"
            tabIndex={aberto ? 0 : -1}
            onClick={() => {
              fechar()
              sair()
            }}
          >
            <Icon name="logOut" size={16} /> Sair
          </button>
        </>
      )}
    </MenuPerfil>
  )
}

function Navbar() {
  const { usuario, carrinho, desejos, setCarrinhoAberto } = useStore()
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
          <button className="nav-icon" onClick={() => setCarrinhoAberto(true)} aria-label={`Carrinho (${carrinho.length})`}>
            <Icon name="cart" size={19} />
            {carrinho.length > 0 && (
              <span key={carrinho.length} className="nav-badge nav-badge-cart">
                {carrinho.length}
              </span>
            )}
          </button>
          {usuario ? <Jogador usuario={usuario} /> : <Visitante />}
        </div>
      </div>
    </header>
  )
}

export default Navbar
