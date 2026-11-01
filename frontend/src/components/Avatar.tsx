import type { CSSProperties } from 'react'
import { DragonMascot } from './Dragon'
import './Avatar.css'

const PALETAS = [
  ['#7c3aed', '#3b82f6'],
  ['#3b82f6', '#06b6d4'],
  ['#db2777', '#7c3aed'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#06b6d4'],
  ['#6366f1', '#ec4899'],
]

type Props = {
  nome: string
  size?: number
  // 0–1: desenha o anel de progresso de XP ao redor do avatar
  progresso?: number
  dragao?: boolean
  className?: string
}

function Avatar({ nome, size = 40, progresso, dragao = false, className = '' }: Props) {
  const hash = [...nome].reduce((s, ch) => s + ch.charCodeAt(0), 0)
  const [a, b] = PALETAS[hash % PALETAS.length]
  const anel = progresso !== undefined
  const raio = 46
  const circunferencia = 2 * Math.PI * raio

  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size, '--av-a': a, '--av-b': b } as CSSProperties}
    >
      {anel && (
        <svg viewBox="0 0 100 100" className="avatar-ring" aria-hidden="true">
          <circle cx="50" cy="50" r={raio} className="avatar-ring-bg" />
          <circle
            cx="50"
            cy="50"
            r={raio}
            className="avatar-ring-fg"
            strokeDasharray={circunferencia}
            strokeDashoffset={circunferencia * (1 - progresso)}
          />
        </svg>
      )}
      <span className="avatar-face" style={{ inset: anel ? size * 0.1 : 0 }}>
        {dragao ? <DragonMascot size={size * 0.62} /> : nome.slice(0, 2).toUpperCase()}
      </span>
    </span>
  )
}

export default Avatar
