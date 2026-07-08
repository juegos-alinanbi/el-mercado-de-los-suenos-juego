# El Mercado de los Suenos

Mini juego educativo de matematica construido con `Next.js`, `React`, `JavaScript`, `Tailwind CSS`, `Framer Motion` y `Zustand`.

## Descripcion
Este proyecto implementa **Michi Money en el Mercado** como una experiencia con 3 niveles jugables. El jugador puede:

- elegir un nivel desde la portada
- leer una mision de compra
- seleccionar productos con cantidades exactas
- calcular subtotales mediante multiplicacion
- respetar un presupuesto
- pagar con monedas y billetes
- validar faltante o cambio
- resolver un reto simple de reparto en el nivel 3

## Niveles actuales
- `Nivel 1`: compra para la merienda
- `Nivel 2`: fiesta de cumpleanos
- `Nivel 3`: merienda compartida con reparto final

## Stack
- `pnpm`
- `Next.js 16`
- `React 19`
- `Tailwind CSS 4`
- `Framer Motion`
- `Zustand`

## Scripts
```bash
pnpm dev
pnpm lint
pnpm build
pnpm verify:logic
```

## Estructura principal
- `src/app`: rutas del juego
- `src/features/market-game`: logica del dominio, casos de uso, store y vistas
- `src/entities`: datos base del juego
- `src/shared`: utilidades, UI reusable y configuracion comun
- `scripts/verify-game-logic.mjs`: verificacion funcional automatizada del MVP

## Flujo del juego
1. `Home` con selector de nivel
2. `Mission`
3. `Market`
4. `Checkout`
5. `Result`

## Validacion funcional
La logica base del juego se puede verificar con:

```bash
pnpm verify:logic
```

Escenarios cubiertos:
- compra correcta
- presupuesto excedido
- producto extra no pedido
- pago insuficiente
- pago suficiente con cambio

## Documentos del proyecto
- `DOCUMENTO_FUNCIONAL_NIVEL_BASICO.md`
- `PLAN_DE_CREACION.md`
- `VERIFICACION_FUNCIONAL_MVP.md`
- `GUIA_REPO_Y_VERCEL.md`

## Desarrollo local
```bash
pnpm install
pnpm dev
```

Luego abre `http://localhost:3000`.
