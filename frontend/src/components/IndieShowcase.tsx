import type { CSSProperties } from 'react'
import { JOGOS } from '../data/jogos'
import { useStore } from '../store/useStore'
import { brl, desconto } from '../utils/format'
import BuyButton from './BuyButton'
import { DragonMascot } from './Dragon'
import GameCover from './GameCover'
import Icon from './Icon'
import './IndieShowcase.css'

const INDIES = JOGOS.filter((j) => j.indie).sort((a, b) => b.nota - a.nota)

function IndieShowcase() {
  const { abrirJogo } = useStore()

  return (
    <section className="section" id="indie">
      <div className="section-head">
        <div>
          <span className="section-kicker">Feito por estúdios independentes</span>
          <h2 className="section-title">💎 Jogos Indie</h2>
          <p className="section-sub">Pequenas equipes, ideias enormes. Uma seleção feita a dedo pela curadoria da Infinity.</p>
        </div>
        <div className="indie-note">
          <DragonMascot size={42} />
          <span>“Esses aqui o Ignis guarda no tesouro.”</span>
        </div>
      </div>

      <div className="indie-grid">
        {INDIES.map((jogo, i) => (
          <article
            key={jogo.id}
            className={`indie-tile ${i === 0 ? 'indie-tile-main' : ''}`}
            style={{ '--glow': jogo.cores[2] } as CSSProperties}
          >
            <button className="indie-art" onClick={() => abrirJogo(jogo)} aria-label={`Ver detalhes de ${jogo.titulo}`}>
              <GameCover jogo={jogo} logo={false} />
            </button>
            <div className="indie-content">
              <span className="indie-genre">
                {jogo.genero} · <Icon name="star" size={12} filled /> {jogo.nota.toFixed(1)}
              </span>
              <h3>{jogo.titulo}</h3>
              {i === 0 && <p>{jogo.descricao}</p>}
              <div className="indie-buy">
                <span className="indie-price">
                  {desconto(jogo) > 0 && <span className="badge badge-off">-{desconto(jogo)}%</span>}
                  {brl(jogo.preco)}
                </span>
                <BuyButton jogo={jogo} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default IndieShowcase
