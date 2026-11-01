import type { Jogo } from '../data/jogos'
import { brl, desconto, gradiente } from '../utils/format'

type Props = {
  jogo: Jogo
  favorito: boolean
  onFavoritar: () => void
  onAdicionar: () => void
}

function GameCard({ jogo, favorito, onFavoritar, onAdicionar }: Props) {
  const off = desconto(jogo)

  return (
    <article className="gs-card">
      <div className="gs-cover" style={{ background: gradiente(jogo.cores) }}>
        <span className="gs-cover-icon">{jogo.icone}</span>
        {jogo.novo && <span className="gs-tag new">Lançamento</span>}
        {off > 0 && <span className="gs-tag off">-{off}%</span>}
        <button
          className={`gs-fav ${favorito ? 'on' : ''}`}
          onClick={onFavoritar}
          aria-label="Favoritar"
        >
          ♥
        </button>
      </div>
      <div className="gs-card-body">
        <div className="gs-platforms">
          {jogo.plataformas.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
        <h3>{jogo.titulo}</h3>
        <div className="gs-meta">
          <span>{jogo.genero}</span>
          <span className="gs-star">★ {jogo.nota.toFixed(1)}</span>
        </div>
        <div className="gs-price-row">
          <div>
            {jogo.precoAntigo && <s>{brl(jogo.precoAntigo)}</s>}
            <strong>{brl(jogo.preco)}</strong>
            <small>ou 10x de {brl(jogo.preco / 10)}</small>
          </div>
          <button className="gs-btn" onClick={onAdicionar}>
            + Carrinho
          </button>
        </div>
      </div>
    </article>
  )
}

export default GameCard
