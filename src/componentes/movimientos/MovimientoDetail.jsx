import { useEffect, useState } from 'react'
import { getMove, getSpanishEffect, getSpanishFlavor, getSpanishName } from '../../servicios/pokeApi'
import { TypeBadge } from '../pokemon/PokemonCard'

function MovimientoDetail({ name, pokemon }) {
  const [move, setMove] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    getMove(name, controller.signal)
      .then(setMove)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [name])

  if (loading) return <p className="status-message">Cargando movimiento…</p>
  if (error) return <p className="status-message status-error" role="alert">{error}</p>
  if (!move) return null

  const translatedName = getSpanishName(move) || move.name.replaceAll('-', ' ')
  const effect = getSpanishEffect(move) || getSpanishEffect(move, 'en') || 'Sin descripción disponible.'
  const flavor = getSpanishFlavor(move)

  return (
    <article className="detail-page move-detail-page">
      <a className="back-link" href={pokemon ? `?pokemon=${pokemon}` : '/'}>← Volver a {pokemon ? 'la ficha Pokémon' : 'la Pokédex'}</a>
      <section className="move-hero">
        <span className="move-hero-icon" aria-hidden="true">✦</span>
        <p className="eyebrow">Ficha de movimiento · #{String(move.id).padStart(3, '0')}</p>
        <h1>{translatedName}</h1>
        <p className="move-original-name">{move.name.replaceAll('-', ' ')}</p>
        {move.type && <TypeBadge type={move.type.name} />}
      </section>
      <section className="detail-section" aria-labelledby="move-data-title">
        <div className="section-heading">
          <p className="eyebrow">Información de combate</p>
          <h2 id="move-data-title">Datos del movimiento</h2>
        </div>
        <div className="data-grid move-data-grid">
          <MoveData label="Tipo" value={move.type?.name} />
          <MoveData label="Categoría" value={move.damage_class?.name} />
          <MoveData label="Potencia" value={move.power ?? '—'} />
          <MoveData label="Precisión" value={move.accuracy ? `${move.accuracy}%` : '—'} />
          <MoveData label="PP" value={move.pp} />
          <MoveData label="Prioridad" value={move.priority} />
          <MoveData label="Objetivo" value={move.target?.name} />
          <MoveData label="Probabilidad de efecto" value={move.effect_chance ? `${move.effect_chance}%` : '—'} />
          <MoveData label="Generación" value={move.generation?.name?.replace('generation-', '').toUpperCase()} />
          <MoveData label="Máximo de usos" value={move.pp * 8} />
          <MoveData label="Crítico" value={move.meta?.crit_rate ? `+${move.meta.crit_rate}` : 'Normal'} />
          <MoveData label="Retroceso" value={move.meta?.drain ? `${Math.abs(move.meta.drain)}%` : 'Ninguno'} />
          <MoveData label="Estado que causa" value={move.meta?.ailment?.name === 'none' ? 'Ninguno' : move.meta?.ailment?.name} />
          <MoveData label="Duración del efecto" value={move.meta?.min_turns && move.meta?.max_turns ? `${move.meta.min_turns}–${move.meta.max_turns} turnos` : '—'} />
          <MoveData label="Golpes" value={move.meta?.min_hits && move.meta?.max_hits ? `${move.meta.min_hits}–${move.meta.max_hits}` : '1'} />
          <MoveData label="Probabilidad de retroceso" value={move.meta?.flinch_chance ? `${move.meta.flinch_chance}%` : '—'} />
          <MoveData label="Curación" value={move.meta?.healing ? `${move.meta.healing}%` : 'Ninguna'} />
          <MoveData label="Categoría de concurso" value={move.contest_type?.name} />
        </div>
        <div className="move-description">
          <h3>Efecto</h3>
          <p>{effect.replace('$effect_chance', String(move.effect_chance))}</p>
          {flavor && <p className="flavor-text">{flavor.replaceAll('\n', ' ')}</p>}
        </div>
      </section>
      {pokemon && (
        <a className="button button-primary move-return-button" href={`?pokemon=${pokemon}`}>
          Volver a #{String(pokemon).padStart(3, '0')}
        </a>
      )}
    </article>
  )
}

function MoveData({ label, value }) {
  return (
    <div className="data-item">
      <span>{label}</span>
      <strong>{value ?? '—'}</strong>
    </div>
  )
}

export default MovimientoDetail
