import type { CSSProperties } from 'react'
import type { Jogo } from '../data/jogos'
import { useStore } from '../store/useStore'
import { brl, compacto, desconto, modoCurto } from '../utils/format'
import BuyButton from './BuyButton'
import { DragonSeal } from './Dragon'
import GameCover from './GameCover'
import Icon from './Icon'
import './GameCard.css'

type Props = {
  jogo: Jogo
  // Texto exibido no canto da capa (ex.: data de lançamento)
  etiqueta?: string
  // Motivo da recomendação
  motivo?: string
}

function GameCard({ jogo, etiqueta, motivo }: Props) {
  const { desejos, alternarDesejo, abrirJogo } = useStore()
  const off = desconto(jogo)
  const desejado = desejos.has(jogo.id)

  return (
    <article className="card" style={{ '--glow': jogo.cores[2] } as CSSProperties}>
      <button className="card-media" onClick={() => abrirJogo(jogo)} aria-label={`Ver detalhes de ${jogo.titulo}`}>
        <GameCover jogo={jogo} />
        <span className="card-badges">
          {etiqueta && <span className="badge card-label">{etiqueta}</span>}
          {jogo.novo && !etiqueta && <span className="badge badge-new">Novo</span>}
          {off > 0 && <span className="badge badge-off">-{off}%</span>}
        </span>
        <span className="card-peek">
          <Icon name="play" size={14} filled /> Ver detalhes
        </span>
      </button>

      <button
        className={`card-wish ${desejado ? 'on' : ''}`}
        onClick={() => alternarDesejo(jogo)}
        aria-pressed={desejado}
        aria-label={desejado ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
      >
        <Icon name="heart" size={16} filled={desejado} />
      </button>

      <div className="card-body">
        <div className="card-top">
          <span className="card-genre">{jogo.genero}</span>
          <span className="card-mode">
            <Icon name={jogo.modo === 'Singleplayer' ? 'user' : 'users'} size={13} />
            {modoCurto[jogo.modo]}
          </span>
        </div>

        <h3 className="card-title">
          {jogo.titulo}
          {jogo.dragao && <DragonSeal compact className="card-seal" />}
        </h3>
        {motivo && <p className="card-reason">{motivo}</p>}

        <div className="card-stats">
          <span className="card-rating">
            <Icon name="star" size={13} filled /> {jogo.nota.toFixed(1)}
            <small>({compacto(jogo.avaliacoes)})</small>
          </span>
          <span>
            <Icon name="clock" size={13} /> ~{jogo.horas}h
          </span>
        </div>

        <div className="card-platforms">
          {jogo.plataformas.map((p) => (
            <span key={p} className="platform-tag">{p}</span>
          ))}
        </div>

        <div className="card-buy">
          <div className="card-price">
            {jogo.precoAntigo && <span className="price-old">{brl(jogo.precoAntigo)}</span>}
            <strong>{brl(jogo.preco)}</strong>
          </div>
          <BuyButton jogo={jogo} />
        </div>
      </div>
    </article>
  )
}

export default GameCard
