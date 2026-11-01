import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { brl, compacto, dataCurta, desconto } from '../utils/format'
import BuyButton from './BuyButton'
import { DragonSeal } from './Dragon'
import GameCover from './GameCover'
import Icon from './Icon'
import Stars from './Stars'
import './GameModal.css'

// Detalhes do jogo, com modo "trailer" (prévia cinematográfica da arte)
function GameModal() {
  const { modal, fecharJogo, desejos, alternarDesejo } = useStore()
  const [tocando, setTocando] = useState(true)

  useEffect(() => {
    if (!modal) return
    setTocando(true)
    document.body.classList.add('sem-rolagem')
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && fecharJogo()
    addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('sem-rolagem')
      removeEventListener('keydown', onKeyDown)
    }
    // Depende só de `modal`: fecharJogo muda a cada render e reiniciaria o trailer
  }, [modal])

  if (!modal) return null
  const { jogo, trailer } = modal
  const off = desconto(jogo)
  const desejado = desejos.has(jogo.id)

  return (
    <div className="modal-overlay" onClick={fecharJogo}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={jogo.titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={fecharJogo} aria-label="Fechar">
          <Icon name="x" size={20} />
        </button>

        <div className={`modal-media ${trailer ? 'trailer' : ''} ${tocando ? 'playing' : ''}`}>
          <GameCover jogo={jogo} logo={false} />
          {trailer && (
            <>
              <div className="modal-letterbox" />
              <div className="modal-trailer-title">
                <small>Infinity Games apresenta</small>
                <strong>{jogo.titulo}</strong>
              </div>
              <div className="modal-player">
                <button onClick={() => setTocando(!tocando)} aria-label={tocando ? 'Pausar' : 'Reproduzir'}>
                  <Icon name={tocando ? 'pause' : 'play'} size={16} filled />
                </button>
                <div className="modal-player-bar">
                  <span />
                </div>
                <small>Trailer · 1:24</small>
              </div>
            </>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-main">
            <div className="modal-tags">
              <span className="modal-genre">{jogo.genero}</span>
              {jogo.indie && <span className="badge badge-new">Indie</span>}
              {jogo.dragao && <DragonSeal />}
            </div>
            <h2>{jogo.titulo}</h2>
            <p>{jogo.descricao}</p>
            <div className="modal-rating">
              <Stars nota={jogo.nota} />
              <strong>{jogo.nota.toFixed(1)}</strong>
              <span>{compacto(jogo.avaliacoes)} avaliações de jogadores</span>
            </div>
          </div>

          <aside className="modal-side">
            <dl className="modal-facts">
              <div>
                <dt>
                  <Icon name="clock" size={14} /> Gameplay médio
                </dt>
                <dd>~{jogo.horas} horas</dd>
              </div>
              <div>
                <dt>
                  <Icon name={jogo.modo === 'Singleplayer' ? 'user' : 'users'} size={14} /> Modo
                </dt>
                <dd>{jogo.modo}</dd>
              </div>
              <div>
                <dt>
                  <Icon name="gamepad" size={14} /> Plataformas
                </dt>
                <dd className="modal-platforms">
                  {jogo.plataformas.map((p) => (
                    <span key={p} className="platform-tag">{p}</span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>
                  <Icon name="sparkles" size={14} /> Lançamento
                </dt>
                <dd>{dataCurta(jogo.lancamento)}</dd>
              </div>
            </dl>

            <div className="modal-buy">
              <div className="modal-price">
                {off > 0 && (
                  <span>
                    <span className="badge badge-off">-{off}%</span>
                    <span className="price-old">{brl(jogo.precoAntigo!)}</span>
                  </span>
                )}
                <strong>{brl(jogo.preco)}</strong>
              </div>
              <div className="modal-actions">
                <BuyButton jogo={jogo} tamanho="md" />
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
          </aside>
        </div>
      </div>
    </div>
  )
}

export default GameModal
