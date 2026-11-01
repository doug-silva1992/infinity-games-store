import { useId } from 'react'
import './Logo.css'

const INFINITO = 'M24 12c-3-4-6.5-8-12-8a8 8 0 0 0 0 16c5.5 0 9-4 12-8s6.5-8 12-8a8 8 0 0 1 0 16c-5.5 0-9-4-12-8Z'

function Logo() {
  const gradId = `logo${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <a href="#topo" className="logo" aria-label="Infinity Games, voltar ao início">
      <svg viewBox="0 0 48 24" className="logo-mark" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="0.55" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d={INFINITO} fill="none" stroke={`url(#${gradId})`} strokeWidth="3.4" strokeLinejoin="round" />
        <path d={INFINITO} className="logo-flow" fill="none" strokeWidth="3.4" pathLength={100} />
      </svg>
      <span className="logo-word">
        <strong>INFINITY</strong>
        <span>GAMES</span>
      </span>
    </a>
  )
}

export default Logo
