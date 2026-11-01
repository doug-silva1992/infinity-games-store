import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { jogoPorId } from '../data/jogos'
import { useStore } from '../store/useStore'
import { brl, compacto, desconto } from '../utils/format'
import BuyButton from './BuyButton'
import { DragonSeal } from './Dragon'
import { DRAGAO_SILHUETA } from './dragon-paths'
import GameCover from './GameCover'
import Icon from './Icon'
import Stars from './Stars'
import './Hero.css'

const DESTAQUES = [2, 1, 13].map(jogoPorId)

function Hero() {
  const { desejos, alternarDesejo, abrirJogo } = useStore()
  const [indice, setIndice] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const jogo = DESTAQUES[indice]
  const off = desconto(jogo)
  const desejado = desejos.has(jogo.id)

  // Parallax: a posição do ponteiro move as camadas em profundidades diferentes
  const onPointerMove = (e: PointerEvent) => {
    const el = heroRef.current
    if (!el || e.pointerType !== 'mouse') return
    const box = el.getBoundingClientRect()
    el.style.setProperty('--mx', (((e.clientX - box.left) / box.width) * 2 - 1).toFixed(3))
    el.style.setProperty('--my', (((e.clientY - box.top) / box.height) * 2 - 1).toFixed(3))
  }

  const proximo = () => setIndice((i) => (i + 1) % DESTAQUES.length)

  return (
    <section
      id="topo"
      ref={heroRef}
      className="hero"
      onPointerMove={onPointerMove}
      style={{ '--hero-glow': jogo.cores[2] } as CSSProperties}
    >
      <div className="hero-stage" key={jogo.id}>
        <div className="hero-art">
          <GameCover jogo={jogo} logo={false} dragao={false} />
        </div>
        {jogo.dragao && jogo.cena === 'montanhas' && (
          <svg viewBox="0 0 200 120" className="hero-dragon" aria-hidden="true">
            <path d={DRAGAO_SILHUETA} />
          </svg>
        )}
        <div className="hero-embers" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </div>
        <div className="hero-light" />
        <div className="hero-shade" />
      </div>

      <div className="hero-content" key={`c${jogo.id}`}>
        <div className="hero-tags">
          <span className="hero-kicker">
            <Icon name="flame" size={14} /> Destaque da semana
          </span>
          {jogo.dragao && <DragonSeal />}
        </div>

        <h1 className="hero-title">{jogo.titulo}</h1>
        <p className="hero-desc">{jogo.descricao}</p>

        <div className="hero-meta">
          <span className="hero-rating">
            <Stars nota={jogo.nota} />
            <strong>{jogo.nota.toFixed(1)}</strong>
            <small>{compacto(jogo.avaliacoes)} avaliações</small>
          </span>
          <span className="hero-sep" />
          <span className="hero-platforms">
            {jogo.plataformas.map((p) => (
              <span key={p} className="platform-tag">{p}</span>
            ))}
          </span>
          <span className="hero-sep" />
          <span className="hero-fact">
            <Icon name={jogo.modo === 'Singleplayer' ? 'user' : 'users'} size={15} /> {jogo.modo}
          </span>
          <span className="hero-fact">
            <Icon name="clock" size={15} /> ~{jogo.horas}h
          </span>
        </div>

        <div className="hero-buy">
          <div className="hero-price">
            {off > 0 && (
              <span className="hero-price-off">
                <span className="badge badge-off">-{off}%</span>
                <span className="price-old">{brl(jogo.precoAntigo!)}</span>
              </span>
            )}
            <strong>{brl(jogo.preco)}</strong>
          </div>
          <div className="hero-actions">
            <BuyButton jogo={jogo} tamanho="md" rotulo="Comprar agora" />
            <button className="btn btn-ghost" onClick={() => abrirJogo(jogo, true)}>
              <Icon name="play" size={15} filled /> Ver trailer
            </button>
            <button
              className={`btn btn-ghost btn-icon ${desejado ? 'on' : ''}`}
              onClick={() => alternarDesejo(jogo)}
              aria-pressed={desejado}
              aria-label="Lista de desejos"
            >
              <Icon name="heart" size={18} filled={desejado} />
            </button>
          </div>
        </div>
      </div>

      <div className="hero-thumbs" role="tablist" aria-label="Jogos em destaque">
        {DESTAQUES.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={i === indice}
            className={`hero-thumb ${i === indice ? 'active' : ''}`}
            onClick={() => setIndice(i)}
          >
            <span className="hero-thumb-art">
              <GameCover jogo={d} logo={false} />
            </span>
            <span className="hero-thumb-info">
              <strong>{d.titulo}</strong>
              <small>{d.genero}</small>
            </span>
            {i === indice && <span className="hero-thumb-progress" onAnimationEnd={proximo} />}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Hero
