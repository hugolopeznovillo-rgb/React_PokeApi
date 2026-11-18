import { useState } from 'react'

function Menu() {
  const [query, setQuery] = useState('')

  function handleSearch(event) {
    event.preventDefault()
    const identifier = query.trim().toLowerCase()
    if (!identifier) return
    window.location.href = `?pokemon=${encodeURIComponent(identifier)}`
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Pokédex, inicio">
        <span className="brand-ball" aria-hidden="true"><span /></span>
        <span>Pokédex<span className="brand-dot">.</span></span>
      </a>
      <nav className="top-nav" aria-label="Navegación principal">
        <a href="/">Pokédex</a>
        <a href="https://pokeapi.co/docs/v2" target="_blank" rel="noreferrer">PokéAPI ↗</a>
      </nav>
      <form className="search-form" role="search" onSubmit={handleSearch}>
        <label className="visually-hidden" htmlFor="pokemon-search">Buscar por nombre o número</label>
        <input
          id="pokemon-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Nombre o número…"
        />
        <button type="submit" aria-label="Buscar Pokémon">⌕</button>
      </form>
    </header>
  )
}

export default Menu
