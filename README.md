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

- `src/componentes/Menu.jsx` y `Footer.jsx`: navegación y pie de página.
- `src/componentes/PokemonCard.jsx`: ficha resumida de número, nombre y tipos.
- `src/componentes/PokemonDetail.jsx`: datos, estadísticas, habilidades y movimientos.
- `src/componentes/MovimientoCard.jsx` y `MovimientoDetail.jsx`: acceso y ficha del movimiento.
- `src/api.js`: consultas parametrizadas a PokéAPI.
