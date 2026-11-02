import { useEffect, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { useStore } from '../store/useStore'
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

// Ninguém logado: o botão abre, ao passar o mouse, o menu com entrar e registrar
function Visitante() {
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
        <span className="nav-guest-avatar">
          <Icon name="user" size={20} />
        </span>
        <span className="nav-profile-info">
          <strong>Olá, Visitante</strong>
          <small>Entre ou cadastre-se</small>
        </span>
        <Icon name="chevronDown" size={16} className="nav-profile-caret" />
      </button>
      <div className="nav-menu nav-menu-guest glass" role="menu" aria-hidden={!aberto}>
        <a href="#entrar" role="menuitem" className="btn btn-primary" tabIndex={aberto ? 0 : -1} onClick={() => setAberto(false)}>
          <Icon name="logIn" size={16} /> Entrar
        </a>
        <a href="#registrar" role="menuitem" className="btn btn-ghost" tabIndex={aberto ? 0 : -1} onClick={() => setAberto(false)}>
          <Icon name="userPlus" size={16} /> Registrar
        </a>
        <p>Crie sua conta para ganhar XP, desbloquear conquistas e salvar sua lista de desejos.</p>
      </div>
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
          <button className="nav-icon" onClick={() => setCarrinhoAberto(true)} aria-label={`Carrinho (${carrinho.length})`}>
            <Icon name="cart" size={19} />
            {carrinho.length > 0 && (
              <span key={carrinho.length} className="nav-badge nav-badge-cart">
                {carrinho.length}
              </span>
            )}
          </button>
          <Visitante />
        </div>
      </div>
    </header>
  )
}

export default Navbar
