function MovimientoCard({ move, pokemon }) {
  return (
    <a
      className="move-card"
      href={`?movimiento=${encodeURIComponent(move.name)}&pokemon=${pokemon}`}
    >
      <span className="move-symbol" aria-hidden="true">✦</span>
      <span className="move-name">{move.name.replaceAll('-', ' ')}</span>
      <span className="move-arrow" aria-hidden="true">↗</span>
    </a>
  )
}

export default MovimientoCard
