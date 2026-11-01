import { useId } from 'react'
import './Dragon.css'

type MascoteProps = {
  size?: number
  className?: string
}

// Ignis, o dragão mascote da Infinity Games
export function DragonMascot({ size = 64, className = '' }: MascoteProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`dragon ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}pele`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.6" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`${id}chifre`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#a5f3fc" />
        </linearGradient>
        <radialGradient id={`${id}focinho`} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c3aed" />
        </radialGradient>
        <filter id={`${id}brilho`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Chifres */}
      <path d="M66 74 C46 48 38 26 34 6 C56 22 74 42 84 62 Z" fill={`url(#${id}chifre)`} />
      <path d="M134 74 C154 48 162 26 166 6 C144 22 126 42 116 62 Z" fill={`url(#${id}chifre)`} />

      {/* Membranas laterais */}
      <path d="M54 98 L14 82 L36 106 L16 122 L52 120 Z" fill="#6d28d9" />
      <path d="M146 98 L186 82 L164 106 L184 122 L148 120 Z" fill="#6d28d9" />

      {/* Cabeça */}
      <path
        d="M100 46 C134 46 156 70 156 102 C156 124 146 140 132 152 L120 176 C112 188 88 188 80 176 L68 152 C54 140 44 124 44 102 C44 70 66 46 100 46 Z"
        fill={`url(#${id}pele)`}
      />
      {/* Escamas da testa */}
      <path d="M86 58 L100 66 L114 58" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M80 68 L100 78 L120 68" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />

      {/* Símbolo do infinito na testa */}
      <path
        d="M100 92c-2.6-3.4-5.4-6-9.4-6a6 6 0 0 0 0 12c4 0 6.8-2.6 9.4-6s5.4-6 9.4-6a6 6 0 0 1 0 12c-4 0-6.8-2.6-9.4-6Z"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="3"
        filter={`url(#${id}brilho)`}
      />

      {/* Olhos */}
      <g className="dragon-eyes" filter={`url(#${id}brilho)`}>
        <path d="M60 108 L90 116 L84 128 L64 122 Z" fill="#22d3ee" />
        <path d="M140 108 L110 116 L116 128 L136 122 Z" fill="#22d3ee" />
        <ellipse cx="78" cy="118" rx="2.4" ry="5" fill="#04121a" />
        <ellipse cx="122" cy="118" rx="2.4" ry="5" fill="#04121a" />
      </g>

      {/* Focinho */}
      <ellipse cx="100" cy="156" rx="30" ry="24" fill={`url(#${id}focinho)`} />
      <ellipse cx="90" cy="154" rx="4" ry="2.6" fill="#2e1065" />
      <ellipse cx="110" cy="154" rx="4" ry="2.6" fill="#2e1065" />
      <path d="M84 170 Q100 178 116 170" fill="none" stroke="#2e1065" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

type SeloProps = {
  compact?: boolean
  className?: string
}

export function DragonSeal({ compact = false, className = '' }: SeloProps) {
  return (
    <span
      className={`dragon-seal ${compact ? 'compact' : ''} ${className}`}
      title="Recomendado pelo Dragão"
    >
      <DragonMascot size={compact ? 22 : 20} />
      {!compact && <span>Recomendado pelo Dragão</span>}
    </span>
  )
}
