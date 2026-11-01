import Icon from './Icon'

// Cinco estrelas com preenchimento proporcional à nota (0–5)
function Stars({ nota, size = 15 }: { nota: number; size?: number }) {
  const estrelas = [0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={size} filled />)

  return (
    <span className="stars" role="img" aria-label={`Nota ${nota.toFixed(1)} de 5`}>
      <span className="stars-base">{estrelas}</span>
      <span className="stars-fill" style={{ width: `${(nota / 5) * 100}%` }}>
        {estrelas}
      </span>
    </span>
  )
}

export default Stars
