# Plan de Creacion del Proyecto

## Proyecto
El Mercado de los Suenos - Michi Money en el Mercado

## Objetivo de este documento
Definir una ruta clara de creacion del proyecto para trabajar con orden, evitar omisiones y construir el mini juego con `pnpm` sobre una base moderna, mantenible y alineada con el alcance del nivel basico.

## 1. Alcance confirmado del MVP
El primer entregable sera un mini juego web de un solo nivel donde el jugador debe:

- leer una mision de compra
- seleccionar productos del mercado
- ajustar cantidades
- aplicar suma, resta y multiplicacion
- respetar un presupuesto limitado
- pagar con monedas y billetes
- recibir validacion y retroalimentacion final

## 2. Stack tecnico aprobado
El proyecto se construira con las siguientes tecnologias:

- `pnpm` como gestor de paquetes
- `Next.js` como framework principal
- `React` para las pantallas y componentes
- `JavaScript` para la logica del juego
- `Tailwind CSS` para estilos
- `Framer Motion` para animaciones
- `Zustand` o `useReducer` para el estado del juego
- `Vercel` para despliegue

## 3. Decision arquitectonica
La arquitectura del proyecto seguira tres ideas complementarias:

- `FSD` para organizar el codigo por capas y responsabilidades
- `Arquitectura Hexagonal` para separar la logica del juego de la UI
- `Atomic Design` para construir una interfaz reusable y consistente

## 4. Estructura de alto nivel esperada
```text
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

### Distribucion propuesta
- `app/`: configuracion general, layout, rutas y providers
- `pages/`: paginas principales del juego
- `widgets/`: bloques grandes de interfaz que combinan features y entidades
- `features/`: acciones especificas del usuario, como seleccionar productos o pagar
- `entities/`: modelos del negocio como producto, mision, carrito o billetera
- `shared/`: UI comun, utilidades, constantes, assets y helpers

## 5. Feature principal del juego
La funcionalidad principal sera `market-game`.

Estructura sugerida:

```text
src/features/market-game/
  domain/
  application/
  infrastructure/
  presentation/
```

### Responsabilidad por capa
- `domain/`: reglas puras del negocio del juego
- `application/`: casos de uso y validaciones
- `infrastructure/`: mocks, adaptadores y persistencia local si hace falta
- `presentation/`: componentes, hooks y vistas de la feature

## 6. Pantallas del MVP
El MVP tendra estas pantallas:

1. Inicio
2. Mision
3. Mercado
4. Caja
5. Resultado

### Objetivo por pantalla
- `Inicio`: presentar el juego y permitir comenzar
- `Mision`: explicar objetivo, cantidades y presupuesto
- `Mercado`: seleccionar productos y controlar cantidades
- `Caja`: realizar el pago
- `Resultado`: mostrar exito, error y retroalimentacion

## 7. Componentes principales previstos
Componentes visuales base:

- Button
- Card
- Badge
- Counter
- MoneyChip
- ProgressLabel

Moleculas y organismos:

- ProductCard
- MissionSummary
- BudgetPanel
- CartSummary
- PaymentTray
- FeedbackModal

Widgets:

- GameHeader
- MissionPanel
- MarketBoard
- CheckoutBoard
- ResultPanel

## 8. Dominio del juego
Entidades y conceptos base:

- `Product`
- `CartItem`
- `Mission`
- `Wallet`
- `Payment`
- `GameState`

Reglas del dominio que deben existir:

- calcular subtotal por producto
- calcular total del carrito
- calcular presupuesto restante
- validar cantidades requeridas
- validar que no se exceda presupuesto
- validar monto pagado
- calcular cambio

## 9. Datos iniciales y mocks
Para el primer nivel se prepararan:

- lista de productos mock
- mision mock
- configuracion de monedas y billetes
- textos base del personaje guia

Ejemplo del primer nivel:

- 2 panes de $2
- 1 leche de $3
- 1 manzana de $1
- presupuesto total: $10

## 10. Plan de implementacion por fases

### Fase 1. Bootstrap del proyecto
Objetivo:
Crear el proyecto base con `pnpm` y dejar listas las dependencias principales.

Entregables:

- proyecto Next.js funcionando
- Tailwind configurado
- Framer Motion instalado
- estado base definido
- scripts de desarrollo y build funcionando

### Fase 2. Arquitectura inicial
Objetivo:
Crear la estructura de carpetas y dejar la base del proyecto ordenada.

Entregables:

- estructura `src/` creada
- modulos base de `shared`, `entities`, `features`, `widgets`, `pages`
- aliases de importacion definidos si conviene

### Fase 3. Sistema visual
Objetivo:
Construir el lenguaje visual del juego.

Entregables:

- tokens visuales base
- layout principal
- componentes atomicos
- tarjetas de producto
- paneles de mision y presupuesto

### Fase 4. Logica del juego
Objetivo:
Implementar las reglas centrales del nivel basico.

Entregables:

- seleccion de productos
- control de cantidades
- calculo de subtotales
- calculo de total
- validacion de presupuesto
- validacion de mision

### Fase 5. Caja y pago
Objetivo:
Implementar la mecanica de pago.

Entregables:

- seleccion o arrastre de dinero
- calculo del monto entregado
- validacion de pago
- calculo de cambio

### Fase 6. Retroalimentacion y UX
Objetivo:
Hacer que el juego sea claro, bonito y divertido.

Entregables:

- mensajes de feedback
- animaciones suaves
- estados de error y exito
- experiencia responsiva

### Fase 7. Validacion final
Objetivo:
Revisar que el MVP cumpla lo funcional y lo visual.

Entregables:

- checklist de validacion completo
- pruebas manuales del flujo entero
- build lista para despliegue

## 11. Checklist tecnico antes de crear el proyecto
Antes de levantar el scaffold debemos confirmar esto:

- usar `pnpm`
- usar `Next.js`
- trabajar con `JavaScript`, no TypeScript
- usar `Tailwind CSS`
- usar `Framer Motion`
- definir si el estado sera con `Zustand` o `useReducer`
- definir nombre tecnico del proyecto

## 12. Recomendacion sobre manejo de estado
Para este MVP recomiendo una de estas dos opciones:

### Opcion recomendada
- `Zustand`

Ventajas:

- simple de usar
- muy limpio para estado del juego
- evita prop drilling
- escalable si luego agregan mas niveles

### Opcion minima
- `useReducer`

Ventajas:

- no agrega dependencia extra
- suficiente para el MVP

Recomendacion final:
Usar `Zustand` si quieren una base mas comoda para crecer. Usar `useReducer` si quieren mantener el proyecto muy pequeno.

## 13. Convenciones de trabajo sugeridas
- una carpeta por responsabilidad clara
- logica del negocio separada de la UI
- componentes pequenos y reusables
- mocks iniciales en archivos dedicados
- estilos consistentes y variables visuales definidas
- commits pequenos por fase

## 14. Criterios de exito del proyecto
El proyecto estara bien encaminado si:

- el scaffold con `pnpm` queda limpio
- la arquitectura base queda creada antes de meter mucha logica
- la UI y la logica evolucionan por fases
- el MVP completo puede jugarse de inicio a fin
- el juego ensena suma, resta, multiplicacion, presupuesto y cambio de forma visible

## 15. Siguiente paso inmediato
El siguiente paso operativo es crear el scaffold del proyecto con `pnpm` usando la configuracion tecnica que acabamos de definir.

Antes de ejecutar eso, solo falta cerrar una ultima decision tecnica:

- `Zustand` o `useReducer`
