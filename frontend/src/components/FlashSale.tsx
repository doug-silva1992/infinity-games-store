import { useEffect, useState, type CSSProperties } from 'react'
import { JOGOS } from '../data/jogos'
import { useStore } from '../store/useStore'
import { brl, desconto } from '../utils/format'
import BuyButton from './BuyButton'
import GameCover from './GameCover'
import Icon from './Icon'
import './FlashSale.css'

const CICLO_MS = 6 * 60 * 60 * 1000
const OFERTAS = JOGOS.filter((j) => j.relampago).sort((a, b) => desconto(b) - desconto(a))

// Ofertas renovam a cada 6 horas: conta o tempo até o próximo ciclo
function tempoRestante() {
  const agora = new Date()
  const meiaNoite = new Date(agora).setHours(0, 0, 0, 0)
  const decorrido = agora.getTime() - meiaNoite
  return CICLO_MS - (decorrido % CICLO_MS)
}

const doisDigitos = (n: number) => String(n).padStart(2, '0')

function FlashSale() {
  const { abrirJogo } = useStore()
  const [restante, setRestante] = useState(tempoRestante)

  useEffect(() => {
    const t = setInterval(() => setRestante(tempoRestante()), 1000)
    return () => clearInterval(t)
  }, [])

  const s = Math.floor(restante / 1000)
  const relogio = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]

  return (
    <section className="section flash" id="promocoes">
      <div className="flash-head">
        <div>
          <span className="section-kicker">Só por algumas horas</span>
          <h2 className="section-title">⚡ Promoções Relâmpago</h2>
          <p className="section-sub">Descontos agressivos com estoque de chaves limitado. Quando o relógio zerar, novas ofertas entram.</p>
        </div>
        <div className="flash-clock" role="timer" aria-label="Tempo restante das ofertas">
          {relogio.map((v, i) => (
            <div key={i} className="flash-clock-unit">
              <strong>{doisDigitos(v)}</strong>
              <small>{['horas', 'min', 'seg'][i]}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="flash-grid">
        {OFERTAS.map((jogo) => {
          const vendido = 52 + ((jogo.id * 17) % 40)
          return (
            <article key={jogo.id} className="flash-card" style={{ '--glow': jogo.cores[2] } as CSSProperties}>
              <button className="flash-media" onClick={() => abrirJogo(jogo)} aria-label={`Ver detalhes de ${jogo.titulo}`}>
                <GameCover jogo={jogo} />
                <span className="flash-off">-{desconto(jogo)}%</span>
              </button>
              <div className="flash-body">
                <div className="flash-stock">
                  <div className="flash-stock-bar">
                    <span style={{ width: `${vendido}%` }} />
                  </div>
                  <small>
                    <Icon name="flame" size={12} /> {vendido}% das chaves vendidas
                  </small>
                </div>
                <div className="flash-buy">
                  <div>
                    <span className="price-old">{brl(jogo.precoAntigo!)}</span>
                    <strong>{brl(jogo.preco)}</strong>
                  </div>
                  <BuyButton jogo={jogo} />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FlashSale
