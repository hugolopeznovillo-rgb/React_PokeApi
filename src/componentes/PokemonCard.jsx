const typeLabels = {
  bug: 'Bicho', dark: 'Siniestro', dragon: 'Dragón', electric: 'Eléctrico',
  fairy: 'Hada', fighting: 'Lucha', fire: 'Fuego', flying: 'Volador',
  ghost: 'Fantasma', grass: 'Planta', ground: 'Tierra', ice: 'Hielo',
  normal: 'Normal', poison: 'Veneno', psychic: 'Psíquico', rock: 'Roca',
  steel: 'Acero', water: 'Agua',
}

export function TypeBadge({ type }) {
  return <span className={`type-badge type-${type}`}>{typeLabels[type] || type}</span>
}

function PokemonCard({ pokemon }) {
  return (
    <a className="pokemon-card" href={`?pokemon=${pokemon.id}`}>
      <div className="pokemon-card-image">
        <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
        <img src={pokemon.sprite} alt={pokemon.name} loading="lazy" />
      </div>
      <div className="pokemon-card-info">
        <h2>{pokemon.name}</h2>
        <div className="type-list">
          {pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}
        </div>
      </div>
      <span className="card-arrow" aria-hidden="true">↗</span>
    </a>
  )
}

export default PokemonCard
