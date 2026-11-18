# Pokédex React

Aplicación responsive hecha con React y Vite para explorar Pokémon y sus movimientos. Los datos se consultan en tiempo real desde [PokéAPI](https://pokeapi.co/).

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Empezar

```bash
npm install
npm run dev
```

Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Navegación con parámetros

La aplicación usa parámetros de URL para que cada ficha se pueda abrir y compartir directamente:

- `?pokemon=25`: ficha completa de un Pokémon, por nombre o número.
- `?movimiento=thunderbolt&pokemon=25`: ficha de un movimiento, con enlace de vuelta al Pokémon.
- `?pagina=2`: página del catálogo.
- `?pokemon=25&pagina=2`: página de movimientos de un Pokémon.

El buscador del menú acepta nombres y números. El catálogo y las fichas muestran estados de carga y errores de consulta.

## Componentes principales

- `src/componentes/layout/`: navegación y pie de página.
- `src/componentes/pokemon/`: fichas resumidas y extensas de Pokémon.
- `src/componentes/movimientos/`: fichas de movimientos.
- `src/servicios/pokeApi.js`: consultas parametrizadas a PokéAPI.
