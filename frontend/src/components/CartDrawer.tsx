import type { Jogo } from '../data/jogos'
import { brl, gradiente } from '../utils/format'

export type ItemCarrinho = Jogo & { qtd: number }

type Props = {
  aberto: boolean
  itens: ItemCarrinho[]
  onFechar: () => void
  onAlterarQtd: (id: number, delta: number) => void
  onFinalizar: () => void
}

function CartDrawer({ aberto, itens, onFechar, onAlterarQtd, onFinalizar }: Props) {
  const subtotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0)
  const economia = itens.reduce(
    (s, i) => s + ((i.precoAntigo ?? i.preco) - i.preco) * i.qtd,
    0,
  )

  return (
    <>
      <div className={`gs-overlay ${aberto ? 'open' : ''}`} onClick={onFechar} />
      <aside className={`gs-drawer ${aberto ? 'open' : ''}`}>
        <div className="gs-drawer-head">
          <h2>Seu carrinho</h2>
          <button className="gs-close" onClick={onFechar}>
            ✕
          </button>
        </div>

        {itens.length === 0 ? (
          <div className="gs-drawer-empty">
            <span>🛒</span>
            <p>Seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            <ul className="gs-cart-list">
              {itens.map((item) => (
                <li key={item.id}>
                  <div className="gs-thumb" style={{ background: gradiente(item.cores) }}>
                    {item.icone}
                  </div>
                  <div className="gs-cart-info">
                    <strong>{item.titulo}</strong>
                    <span>{brl(item.preco)}</span>
                    <div className="gs-qty">
                      <button onClick={() => onAlterarQtd(item.id, -1)}>−</button>
                      <span>{item.qtd}</span>
                      <button onClick={() => onAlterarQtd(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <strong className="gs-line-total">{brl(item.preco * item.qtd)}</strong>
                </li>
              ))}
            </ul>
            <div className="gs-summary">
              {economia > 0 && (
                <div className="gs-row save">
                  <span>Você economiza</span>
                  <span>{brl(economia)}</span>
                </div>
              )}
              <div className="gs-row">
                <span>Subtotal</span>
                <span>{brl(subtotal)}</span>
              </div>
              <div className="gs-row">
                <span>Entrega digital</span>
                <span>Grátis</span>
              </div>
              <div className="gs-row total">
                <span>Total</span>
                <span>{brl(subtotal)}</span>
              </div>
              <button className="gs-btn full" onClick={onFinalizar}>
                Finalizar compra
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
