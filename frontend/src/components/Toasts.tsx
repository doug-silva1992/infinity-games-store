import type { Toast } from '../store/context'
import { useStore } from '../store/useStore'
import { DragonMascot } from './Dragon'
import Icon, { type IconName } from './Icon'
import './Toasts.css'

const ICONES: Record<Toast['tipo'], IconName> = {
  carrinho: 'cart',
  desejo: 'heart',
  conquista: 'trophy',
  nivel: 'sparkles',
  compra: 'check',
  info: 'bell',
}

function Toasts() {
  const { toasts, dispensarToast } = useStore()

  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.tipo}`} role="status">
          <span className="toast-icon">
            {t.tipo === 'conquista' || t.tipo === 'nivel' ? <DragonMascot size={34} /> : <Icon name={ICONES[t.tipo]} size={18} />}
          </span>
          <span className="toast-text">
            {t.tipo === 'conquista' && <small>Conquista desbloqueada</small>}
            <strong>{t.titulo}</strong>
            {t.texto && <span>{t.texto}</span>}
          </span>
          <button className="toast-close" onClick={() => dispensarToast(t.id)} aria-label="Dispensar">
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toasts
