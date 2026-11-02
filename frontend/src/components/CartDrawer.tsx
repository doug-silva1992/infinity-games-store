import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { resumoDoCarrinho } from '../utils/carrinho'
import { brl, desconto, numero } from '../utils/format'
import { DragonMascot } from './Dragon'
import GameCover from './GameCover'
import Icon from './Icon'
import './CartDrawer.css'

function CartDrawer() {
  const { carrinho, carrinhoAberto, setCarrinhoAberto, removerDoCarrinho } = useStore()
  const fechar = () => setCarrinhoAberto(false)

  const { totalCheio, total, economia, xp } = resumoDoCarrinho(carrinho)

  useEffect(() => {
    if (!carrinhoAberto) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setCarrinhoAberto(false)
    addEventListener('keydown', onKeyDown)
    return () => removeEventListener('keydown', onKeyDown)
  }, [carrinhoAberto, setCarrinhoAberto])

  return (
    <>
      <div className={`drawer-overlay ${carrinhoAberto ? 'open' : ''}`} onClick={fechar} />
      <aside className={`drawer ${carrinhoAberto ? 'open' : ''}`} aria-label="Carrinho" aria-hidden={!carrinhoAberto}>
        <div className="drawer-head">
          <h2>
            <Icon name="cart" size={20} /> Seu carrinho
            {carrinho.length > 0 && <span>{carrinho.length}</span>}
          </h2>
          <button className="drawer-close" onClick={fechar} aria-label="Fechar carrinho">
            <Icon name="x" size={20} />
          </button>
        </div>

        {carrinho.length === 0 ? (
          <div className="drawer-empty">
            <DragonMascot size={96} />
            <strong>O Ignis está com fome de jogos</strong>
            <p>Seu carrinho está vazio. Que tal dar uma olhada nas Promoções Relâmpago?</p>
            <a href="#promocoes" className="btn btn-ghost btn-sm" onClick={fechar}>
              <Icon name="bolt" size={15} /> Ver promoções
            </a>
          </div>
        ) : (
          <>
            <ul className="drawer-list">
              {carrinho.map((jogo) => (
                <li key={jogo.id}>
                  <span className="drawer-thumb">
                    <GameCover jogo={jogo} logo={false} />
                  </span>
                  <div className="drawer-info">
                    <strong>{jogo.titulo}</strong>
                    <small>
                      {jogo.genero} · {jogo.plataformas.join(', ')}
                    </small>
                    <span className="drawer-price">
                      {desconto(jogo) > 0 && <span className="price-old">{brl(jogo.precoAntigo!)}</span>}
                      {brl(jogo.preco)}
                    </span>
                  </div>
                  <button className="drawer-remove" onClick={() => removerDoCarrinho(jogo.id)} aria-label={`Remover ${jogo.titulo}`}>
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="drawer-summary">
              <div className="drawer-xp">
                <Icon name="sparkles" size={16} />
                Você vai ganhar <strong>+{numero(xp)} XP</strong> com esta compra
              </div>
              <div className="drawer-row">
                <span>Subtotal</span>
                <span>{brl(totalCheio)}</span>
              </div>
              {economia > 0 && (
                <div className="drawer-row save">
                  <span>Descontos</span>
                  <span>−{brl(economia)}</span>
                </div>
              )}
              <div className="drawer-row">
                <span>Entrega digital</span>
                <span>Imediata</span>
              </div>
              <div className="drawer-row total">
                <span>Total</span>
                <span>{brl(total)}</span>
              </div>
              <a href="#checkout" className="btn btn-primary drawer-checkout" onClick={fechar}>
                Finalizar compra <Icon name="arrowRight" size={16} />
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
