import { useEffect, useState } from 'react'
import { getPokemon, getSpecies, getSpanishFlavor, getSpanishName } from '../../servicios/pokeApi'
import { TypeBadge } from './PokemonCard'
import MovimientoCard from '../movimientos/MovimientoCard'

const MOVES_PER_PAGE = 12

function PokemonDetail({ identifier }) {
  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const params = new URLSearchParams(window.location.search)
  const page = Math.max(1, Number.parseInt(params.get('pagina') || '1', 10) || 1)

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      getPokemon(identifier, controller.signal),
      getSpecies(identifier, controller.signal),
    ])
      .then(([pokemonData, speciesData]) => {
        setPokemon(pokemonData)
        setSpecies(speciesData)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [identifier])

  if (loading) return <p className="status-message">Cargando ficha Pokémon…</p>
  if (error) return <p className="status-message status-error" role="alert">{error}</p>
  if (!pokemon || !species) return null

  const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
  const spriteGallery = [
    { label: 'Artwork oficial', image },
    { label: 'Vista frontal', image: pokemon.sprites.front_default },
    { label: 'Vista trasera', image: pokemon.sprites.back_default },
    { label: 'Frontal variocolor', image: pokemon.sprites.front_shiny },
    { label: 'Trasera variocolor', image: pokemon.sprites.back_shiny },
  ].filter(({ image: sprite }) => sprite)
  const translatedName = getSpanishName(species) || pokemon.name
  const flavor = getSpanishFlavor(species) || getSpanishFlavor(species, 'en')
  const maxMovePage = Math.max(1, Math.ceil(pokemon.moves.length / MOVES_PER_PAGE))
  const currentMovePage = Math.min(page, maxMovePage)
  const visibleMoves = pokemon.moves.slice(
    (currentMovePage - 1) * MOVES_PER_PAGE,
    currentMovePage * MOVES_PER_PAGE,
  )
  const baseParams = new URLSearchParams({ pokemon: String(pokemon.id) })

  return (
    <article className="detail-page">
      <a className="back-link" href="/">← Volver a la Pokédex</a>
      <section className={`pokemon-hero hero-${pokemon.types[0].type.name}`}>
        <div className="pokemon-hero-copy">
          <p className="eyebrow">Ficha Pokémon <span>#{String(pokemon.id).padStart(3, '0')}</span></p>
          <h1>{translatedName}</h1>
          <div className="type-list">
            {pokemon.types.map(({ type }) => <TypeBadge key={type.name} type={type.name} />)}
          </div>
          {flavor && <p className="pokemon-flavor">{flavor.replaceAll('\n', ' ')}</p>}
        </div>
        <img className="pokemon-hero-image" src={image} alt={translatedName} />
        <span className="hero-watermark" aria-hidden="true">#{String(pokemon.id).padStart(3, '0')}</span>
      </section>

      <section className="detail-section" aria-labelledby="general-title">
        <div className="section-heading">
          <p className="eyebrow">Conoce sus características</p>
          <h2 id="general-title">Datos generales</h2>
        </div>
        <div className="data-grid">
          <DataItem label="Número Pokédex" value={`#${String(pokemon.id).padStart(3, '0')}`} />
          <DataItem label="Nombre original" value={pokemon.name} />
          <DataItem label="Especie" value={species.genera?.find(({ language }) => language.name === 'es')?.genus || '—'} />
          <DataItem label="Altura" value={`${(pokemon.height / 10).toFixed(1)} m`} />
          <DataItem label="Peso" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
          <DataItem label="Experiencia base" value={pokemon.base_experience ?? '—'} />
          <DataItem label="Ratio de captura" value={`${species.capture_rate} / 255`} />
          <DataItem label="Ratio de género" value={species.gender_rate === -1 ? 'Sin género' : `${species.gender_rate}/8 ♀`} />
          <DataItem label="Hábitat" value={species.habitat?.name || 'Desconocido'} />
          <DataItem label="Color" value={species.color?.name || '—'} />
          <DataItem label="Forma" value={species.shape?.name || '—'} />
          <DataItem label="Grupos huevo" value={species.egg_groups.map(({ name }) => name).join(', ') || '—'} />
          <DataItem label="Orden en Pokédex" value={species.order} />
          <DataItem label="Felicidad base" value={species.base_happiness} />
          <DataItem label="Crecimiento" value={species.growth_rate.name} />
          <DataItem label="Generación" value={species.generation.name.replace('generation-', '').toUpperCase()} />
          <DataItem label="Pasos para eclosionar" value={(species.hatch_counter + 1) * 255} />
          <DataItem label="Clasificación" value={species.is_mythical ? 'Mítico' : species.is_legendary ? 'Legendario' : species.is_baby ? 'Pokémon bebé' : 'Pokémon'} />
          <DataItem label="Formas" value={pokemon.forms.map(({ name }) => name.replaceAll('-', ' ')).join(', ')} />
          <DataItem label="Aparece en" value={[...new Set(pokemon.game_indices.map(({ version }) => version.name))].join(', ')} />
          <DataItem label="Objetos equipados" value={pokemon.held_items.map(({ item }) => item.name.replaceAll('-', ' ')).join(', ') || 'Ninguno'} />
          <DataItem
            label="Ubicaciones"
            value={<a href={pokemon.location_area_encounters} target="_blank" rel="noreferrer">Ver encuentros ↗</a>}
          />
          <DataItem label="Forma predeterminada" value={pokemon.is_default ? 'Sí' : 'No'} />
        </div>
      </section>

      <section className="detail-section" aria-labelledby="abilities-title">
        <div className="section-heading">
          <p className="eyebrow">Potencial y habilidades</p>
          <h2 id="abilities-title">Estadísticas y habilidades</h2>
        </div>
        <div className="stats-layout">
          <div className="stats-list">
            {pokemon.stats.map(({ base_stat: value, stat }) => (
              <div className="stat-row" key={stat.name}>
                <span>{stat.name.replace('-', ' ')}</span>
                <div className="stat-track"><span style={{ width: `${Math.min(value / 255 * 100, 100)}%` }} /></div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="abilities-panel">
            <h3>Habilidades</h3>
            {pokemon.abilities.map(({ ability, is_hidden: hidden }) => (
              <div className="ability-item" key={ability.name}>
                <span>{ability.name.replaceAll('-', ' ')}</span>
                {hidden && <small>Oculta</small>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section" aria-labelledby="moves-title">
        <div className="section-heading move-heading">
          <div>
            <p className="eyebrow">Su repertorio</p>
            <h2 id="moves-title">Movimientos <span className="muted-count">({pokemon.moves.length})</span></h2>
          </div>
          <span className="move-page-label">Página {currentMovePage} de {maxMovePage}</span>
        </div>
        <div className="moves-grid">
          {visibleMoves.map(({ move }) => (
            <MovimientoCard key={move.name} move={move} pokemon={pokemon.id} />
          ))}
        </div>
        {maxMovePage > 1 && (
          <nav className="pagination move-pagination" aria-label="Páginas de movimientos">
            {currentMovePage > 1 && <a className="button button-secondary" href={`?${new URLSearchParams({ ...Object.fromEntries(baseParams), pagina: String(currentMovePage - 1) })}`}>← Anterior</a>}
            <span>{pokemon.moves.length} movimientos</span>
            {currentMovePage < maxMovePage && <a className="button button-primary" href={`?${new URLSearchParams({ ...Object.fromEntries(baseParams), pagina: String(currentMovePage + 1) })}`}>Siguiente →</a>}
          </nav>
        )}
      </section>
      <section className="detail-section" aria-labelledby="sprites-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Aspecto y variaciones</p>
            <h2 id="sprites-title">Sprites</h2>
          </div>
        </div>
        <div className="sprite-gallery">
          {spriteGallery.map(({ label, image: sprite }) => (
            <figure className="sprite-item" key={label}>
              <img src={sprite} alt={`${translatedName}: ${label.toLowerCase()}`} loading="lazy" />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <nav className="detail-pagination" aria-label="Cambiar de Pokémon">
        {pokemon.id > 1 && <a className="button button-secondary" href={`?pokemon=${pokemon.id - 1}`}>← #{String(pokemon.id - 1).padStart(3, '0')}</a>}
        <a className="button button-primary" href={`?pokemon=${pokemon.id + 1}`}>#{String(pokemon.id + 1).padStart(3, '0')} →</a>
      </nav>
    </article>
  )
}

function DataItem({ label, value }) {
  return (
    <div className="data-item">
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  )
}

export default PokemonDetail
