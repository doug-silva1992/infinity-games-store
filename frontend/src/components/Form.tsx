import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import Icon, { type IconName } from './Icon'
import './Form.css'

// Peças de formulário compartilhadas pelas telas de conta e de pagamento
type CampoProps = {
  rotulo: string
  icone: IconName
  tipo?: 'text' | 'email' | 'password' | 'tel'
  valor: string
  aoMudar: (valor: string) => void
  erro?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>

export function Campo({ rotulo, icone, tipo = 'text', valor, aoMudar, erro, ...resto }: CampoProps) {
  const [mostrar, setMostrar] = useState(false)
  const senha = tipo === 'password'

  return (
    <label className="form-field">
      <span>{rotulo}</span>
      <span className="form-input">
        <Icon name={icone} size={18} />
        <input
          type={senha && mostrar ? 'text' : tipo}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          aria-invalid={!!erro}
          {...resto}
        />
        {senha && (
          <button
            type="button"
            className="form-eye"
            onClick={() => setMostrar(!mostrar)}
            aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={mostrar}
          >
            <Icon name={mostrar ? 'eyeOff' : 'eye'} size={18} />
          </button>
        )}
      </span>
      {erro && <small className="form-error">{erro}</small>}
    </label>
  )
}

export function Marcar({ marcado, aoMudar, children }: { marcado: boolean; aoMudar: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="form-check">
      <input type="checkbox" checked={marcado} onChange={(e) => aoMudar(e.target.checked)} />
      <span className="form-box">
        <Icon name="check" size={13} />
      </span>
      <span>{children}</span>
    </label>
  )
}

export function Enviar({ enviando, rotulo, carregando }: { enviando: boolean; rotulo: ReactNode; carregando: string }) {
  return (
    <button type="submit" className="btn btn-primary form-submit" disabled={enviando}>
      {enviando ? (
        <>
          <span className="form-spinner" /> {carregando}
        </>
      ) : (
        <>
          {rotulo} <Icon name="arrowRight" size={18} />
        </>
      )}
    </button>
  )
}
