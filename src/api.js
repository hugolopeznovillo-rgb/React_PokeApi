const API_URL = 'https://pokeapi.co/api/v2'

export async function fetchResource(path, signal) {
  const response = await fetch(`${API_URL}/${path}`, { signal })
  if (!response.ok) {
    if (response.status === 404) throw new Error('No se han encontrado datos para ese parámetro.')
    throw new Error(`No se pudo consultar la PokéAPI (error ${response.status}).`)
  }
  return response.json()
}

export function getPokemon(identifier, signal) {
  return fetchResource(`pokemon/${encodeURIComponent(identifier)}`, signal)
}

export function getSpecies(identifier, signal) {
  return fetchResource(`pokemon-species/${encodeURIComponent(identifier)}`, signal)
}

export function getMove(identifier, signal) {
  return fetchResource(`move/${encodeURIComponent(identifier)}`, signal)
}

export async function getPokemonList(offset, limit, signal) {
  const list = await fetchResource(`pokemon?offset=${offset}&limit=${limit}`, signal)
  return Promise.all(
    list.results.map(async (entry) => {
      const pokemon = await fetchResource(
        `pokemon/${encodeURIComponent(entry.name)}`,
        signal,
      )
      return {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(({ type }) => type.name),
      }
    }),
  )
}

export function getSpanishName(resource, language = 'es') {
  return resource.names?.find(({ language: entryLanguage }) => entryLanguage.name === language)?.name
}

export function getSpanishFlavor(resource, language = 'es') {
  return resource.flavor_text_entries?.find(
    ({ language: entryLanguage }) => entryLanguage.name === language,
  )?.flavor_text
}

export function getSpanishEffect(resource, language = 'es') {
  return resource.effect_entries?.find(
    ({ language: entryLanguage }) => entryLanguage.name === language,
  )?.short_effect
}
