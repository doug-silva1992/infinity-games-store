import { DragonMascot } from './Dragon'
import Logo from './Logo'
import './Footer.css'

const COLUNAS = [
  { titulo: 'Loja', links: [['Em alta', '#em-alta'], ['Promoções', '#promocoes'], ['Lançamentos', '#lancamentos'], ['Indie', '#indie']] },
  { titulo: 'Comunidade', links: [['Ranking', '#ranking'], ['Conquistas', '#conquistas'], ['Lista de desejos', '#desejos']] },
  { titulo: 'Explorar', links: [['Mais vendidos', '#mais-vendidos'], ['Recomendados', '#recomendados'], ['Catálogo', '#catalogo']] },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo />
          <p>Uma plataforma feita por gamers, para gamers. Jogos digitais, conquistas e uma comunidade que joga junto.</p>
          <div className="footer-ignis">
            <DragonMascot size={52} />
            <span>
              <strong>Ignis</strong>
              Guardião oficial da Infinity Games
            </span>
          </div>
        </div>
        {COLUNAS.map((col) => (
          <nav key={col.titulo} className="footer-col" aria-label={col.titulo}>
            <strong>{col.titulo}</strong>
            {col.links.map(([rotulo, href]) => (
              <a key={href} href={href}>
                {rotulo}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Infinity Games. Todos os direitos reservados.</span>
        <span>Títulos e artes fictícios para demonstração.</span>
      </div>
    </footer>
  )
}

export default Footer
