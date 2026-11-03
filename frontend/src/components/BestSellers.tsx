import type { CSSProperties } from 'react'
import { JOGOS } from '../data/jogos'
import { useStore } from '../store/useStore'
import { brl, compacto, desconto } from '../utils/format'
import BuyButton from './BuyButton'
import GameCover from './GameCover'
import Icon from './Icon'
import Stars from './Stars'
import './BestSellers.css'

const TOP = [...JOGOS].sort((a, b) => b.vendas - a.vendas).slice(0, 5)

function BestSellers() {
  const { abrirJogo } = useStore()
  const [campeao, ...demais] = TOP
  if (!campeao) return null

  return (
    <section className="section" id="mais-vendidos">
      <div className="section-head">
        <div>
          <span className="section-kicker">Ranking semanal</span>
          <h2 className="section-title">🏆 Mais Vendidos</h2>
          <p className="section-sub">Os jogos que a comunidade Infinity mais comprou nos últimos 7 dias.</p>
        </div>
      </div>

      <div className="best">
        <article className="best-champion" style={{ '--glow': campeao.cores[2] } as CSSProperties}>
          <button className="best-champion-art" onClick={() => abrirJogo(campeao)} aria-label={`Ver detalhes de ${campeao.titulo}`}>
            <GameCover jogo={campeao} logo={false} />
          </button>
          <span className="best-crown">
            <Icon name="trophy" size={16} /> Nº 1 da semana
          </span>
          <div className="best-champion-info">
            <span className="best-rank-big">01</span>
            <div>
              <h3>{campeao.titulo}</h3>
              <div className="best-champion-meta">
                <Stars nota={campeao.nota} size={14} />
                <span>{campeao.genero}</span>
                <span>{compacto(campeao.vendas)} cópias esta semana</span>
              </div>
            </div>
            <div className="best-champion-buy">
              <strong>{brl(campeao.preco)}</strong>
              <BuyButton jogo={campeao} tamanho="md" />
            </div>
          </div>
        </article>

        <ol className="best-list">
          {demais.map((jogo, i) => (
            <li key={jogo.id} className="best-row" style={{ '--glow': jogo.cores[2] } as CSSProperties}>
              <span className="best-rank">{String(i + 2).padStart(2, '0')}</span>
              <button className="best-thumb" onClick={() => abrirJogo(jogo)} aria-label={`Ver detalhes de ${jogo.titulo}`}>
                <GameCover jogo={jogo} logo={false} />
              </button>
              <div className="best-info">
                <strong>{jogo.titulo}</strong>
                <small>
                  <Icon name="star" size={12} filled /> {jogo.nota.toFixed(1)} · {jogo.genero} · {compacto(jogo.vendas)} vendas
                </small>
              </div>
              <div className="best-price">
                {desconto(jogo) > 0 && <span className="badge badge-off">-{desconto(jogo)}%</span>}
                <strong>{brl(jogo.preco)}</strong>
              </div>
              <BuyButton jogo={jogo} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default BestSellers
