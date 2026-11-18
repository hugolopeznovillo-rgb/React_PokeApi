import { useEffect, useState } from 'react'
import { getPokemonList } from './servicios/pokeApi'
import Footer from './componentes/layout/Footer'
import Menu from './componentes/layout/Menu'
import MovimientoDetail from './componentes/movimientos/MovimientoDetail'
import PokemonCard from './componentes/pokemon/PokemonCard'
import PokemonDetail from './componentes/pokemon/PokemonDetail'
import './App.css'

const PAGE_SIZE = 12

function App() {
  const params = new URLSearchParams(window.location.search)
  const pokemon = params.get('pokemon')
  const movimiento = params.get('movimiento')
  const page = Math.max(1, Number.parseInt(params.get('pagina') || '1', 10) || 1)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(!pokemon && !movimiento)
  const [error, setError] = useState('')

  useEffect(() => {
    if (pokemon || movimiento) return undefined

    const controller = new AbortController()
    getPokemonList((page - 1) * PAGE_SIZE, PAGE_SIZE, controller.signal)
      .then(setResults)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [pokemon, movimiento, page])

  return (
    <div className="app-shell">
      <Menu />
      <main className="main-content">
        {movimiento ? (
          <MovimientoDetail name={movimiento} pokemon={pokemon} />
        ) : pokemon ? (
          <PokemonDetail identifier={pokemon} />
        ) : (
          <section className="catalog" aria-labelledby="catalog-title">
            <div className="catalog-heading">
              <div>
                <p className="eyebrow">Tu guía del mundo Pokémon</p>
                <h1 id="catalog-title">Pokédex</h1>
                <p className="section-lead">
                  Explora Pokémon, descubre sus características y consulta sus
                  movimientos.
                </p>
              </div>
              <span className="catalog-count">#{String((page - 1) * PAGE_SIZE + 1).padStart(3, '0')}—#{String(page * PAGE_SIZE).padStart(3, '0')}</span>
            </div>

            {loading && <p className="status-message">Cargando Pokémon…</p>}
            {error && <p className="status-message status-error" role="alert">{error}</p>}
            {!loading && !error && (
              <>
                <div className="pokemon-grid">
                  {results.map((entry) => (
                    <PokemonCard key={entry.id} pokemon={entry} />
                  ))}
                </div>
                <nav className="pagination" aria-label="Páginas de Pokémon">
                  {page > 1 && (
                    <a className="button button-secondary" href={`?pagina=${page - 1}`}>
                      ← Anterior
                    </a>
                  )}
                  <span>Página {page}</span>
                  <a className="button button-primary" href={`?pagina=${page + 1}`}>
                    Siguiente →
                  </a>
                </nav>
              </>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
