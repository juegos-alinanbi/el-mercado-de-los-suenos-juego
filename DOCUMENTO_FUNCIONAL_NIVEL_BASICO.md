# Documento Funcional

## Proyecto
**El Mercado de los Suenos**

## Nombre del mini juego
**Michi Money en el Mercado**

## Version
Juego base con 3 niveles

## Proposito
Desarrollar un mini juego interactivo de matematica para ninos de 7 a 14 anos, en el que aprendan a administrar dinero dentro de un mercado virtual mediante una experiencia visual, simple y divertida.

## Objetivo pedagogico
El jugador practica operaciones matematicas basicas dentro de una situacion cotidiana de compra, presupuesto, pago y cambio.

Conceptos que se trabajan:

- suma de precios
- resta de presupuesto restante
- multiplicacion como suma repetida
- comparacion de precios y montos
- uso de monedas y billetes
- calculo de cambio
- toma de decisiones de compra
- division simple por reparto en el nivel 3

## Evolucion del juego
La primera version se penso como un nivel basico unico. Despues se ampliaron 2 niveles adicionales, reutilizando la misma mecanica principal y agregando mas dificultad y un reto extra de reparto.

## Objetivo del juego
El jugador debe completar una mision de compra seleccionando productos correctos dentro de un presupuesto limitado, calculando cantidades y realizando el pago correctamente en caja.

## Publico objetivo
- ninos de 7 a 14 anos

## Alcance actual del juego
La experiencia actual mantiene una base simple y clara, pero ya no se limita a una sola mision.

Incluye:

- pantalla de inicio con selector de niveles
- 3 misiones jugables
- 6 a 8 productos en pantalla
- presupuestos distintos segun el nivel
- 1 flujo de compra por nivel
- 1 flujo de pago por nivel
- retroalimentacion visual y textual
- cantidades por producto
- subtotales por producto
- reto extra de reparto en el nivel 3

Todavia no incluye:

- inventario complejo
- cronometro
- sistema de puntos avanzado
- tienda propia o progreso extendido

## Narrativa breve
Michi Money necesita ayuda para comprar productos para distintas situaciones: una merienda simple, una fiesta y una merienda compartida. El jugador debe entrar al mercado, elegir los productos correctos, controlar las cantidades y pagar sin gastar mas del dinero disponible.

## Mecanica principal
El jugador elige un nivel, recibe una mision de compra, explora un mercado visual con varios productos y sus precios, define cuantas unidades necesita, controla el total gastado y finalmente paga usando monedas y billetes.

## Niveles del juego
### Nivel 1: La compra para la merienda
Objetivo:

- comprar 2 panes
- comprar 1 leche
- comprar 1 manzana

Presupuesto disponible:

- $10

Resultado esperado:

- 2 panes x $2 = $4
- 1 leche x $3 = $3
- 1 manzana x $1 = $1
- total esperado: $8
- presupuesto restante: $2

### Nivel 2: La fiesta de cumpleanos
Objetivo:

- comprar 3 panes
- comprar 2 leches
- comprar 2 manzanas
- comprar 1 queso

Presupuesto disponible:

- $20

Resultado esperado:

- 3 panes x $2 = $6
- 2 leches x $3 = $6
- 2 manzanas x $1 = $2
- 1 queso x $5 = $5
- total esperado: $19
- presupuesto restante: $1

### Nivel 3: La merienda compartida
Objetivo:

- comprar 2 panes
- comprar 1 leche
- comprar 6 manzanas

Presupuesto disponible:

- $15

Resultado esperado:

- 2 panes x $2 = $4
- 1 leche x $3 = $3
- 6 manzanas x $1 = $6
- total esperado: $13
- presupuesto restante: $2

Reto extra:

- repartir 6 manzanas entre 3 personas
- resultado correcto: 2 manzanas para cada una

## Productos del juego
Productos base del mercado:

- Pan: $2
- Leche: $3
- Manzana: $1
- Jugo: $4
- Galletas: $3
- Queso: $5

## Como se ve la multiplicacion en el juego
Cada producto debe mostrar:

- nombre
- precio unitario
- selector o contador de cantidad
- subtotal del producto

Ejemplo visual esperado:

- Pan | $2 c/u | cantidad: 2 | subtotal: $4

Asi el jugador no solo suma productos, sino que aprende que comprar varias unidades implica multiplicar el precio por la cantidad.

## Como se ven la suma, la resta y la comparacion en el juego
La interfaz debe hacer visibles las operaciones en pantalla para que el aprendizaje no quede oculto solo en la logica.

- Suma: en la mision, el mercado o el resultado puede mostrarse la suma completa de los subtotales, por ejemplo `$4 + $3 + $1 = $8`.
- Resta: en la caja y en el resultado se muestra la resta entre presupuesto y total (`$10 - $8 = $2`) y entre pago y total cuando aplica.
- Comparacion: en la caja y en el resultado se puede mostrar la comparacion entre el pago y el total usando `>`, `<` o `=`.
- Division: en el nivel 3 se presenta un reparto simple despues de la compra exitosa.

Ejemplo completo visible en el flujo:

```text
2 x $2 = $4
1 x $3 = $3
1 x $1 = $1
$4 + $3 + $1 = $8
$10 - $8 = $2
$8 = $8
```

## Flujo del juego
### 1. Pantalla de inicio
Se muestra el nombre del juego, una ilustracion amigable, el selector de niveles y una tarjeta que destaca la mision inicial.

### 2. Pantalla de mision
Se presenta la tarea de forma clara:

- que productos debe comprar
- cuantas unidades necesita
- cuanto dinero tiene
- mensaje breve de motivacion

Ejemplo de texto del nivel 1:
"Ayuda a Michi Money a comprar la merienda. Tenemos $10. Compra 2 panes, 1 leche y 1 manzana."

### 3. Pantalla del mercado
Se muestran los productos disponibles con:

- imagen
- nombre
- precio unitario
- boton para sumar cantidad
- boton para restar cantidad
- cantidad seleccionada
- subtotal por producto

### 4. Carrito de compras
El juego debe mostrar siempre:

- productos seleccionados
- cantidad de cada producto
- subtotal por producto
- total acumulado
- dinero restante
- productos obligatorios pendientes

### 5. Validacion previa a caja
Antes de pasar a pagar, el juego revisa si:

- estan todos los productos requeridos
- las cantidades son correctas
- el presupuesto no fue superado

Si algo esta mal, se informa al jugador con mensajes simples.

### 6. Pantalla de caja
El jugador debe pagar el total usando dinero visual.

Elementos sugeridos:

- monedas de $1
- billetes de $5
- billete de $20 para el nivel 2

El jugador arrastra o selecciona el dinero hasta completar el pago.

### 7. Resultado final
El juego muestra un mensaje final segun el resultado:

- exito si completo la compra y pago correctamente
- retroalimentacion si falto dinero, sobro dinero sin comprender el cambio o selecciono mal productos o cantidades
- reto de reparto en el nivel 3 cuando la compra fue exitosa

## Reglas del nivel
- El jugador debe comprar todos los productos obligatorios de la mision.
- El jugador debe respetar las cantidades pedidas.
- El jugador no debe superar el presupuesto disponible.
- El jugador debe llegar a caja con una compra valida.
- El jugador debe pagar el total correctamente.
- Si paga mas del total, el juego debe indicar el cambio correspondiente.

## Validaciones funcionales
### Validacion de seleccion de productos
El sistema debe comprobar:

- si el producto requerido fue agregado
- si falta algun producto obligatorio
- si la cantidad pedida es correcta
- si el total acumulado supera el presupuesto

### Validacion de multiplicacion
El sistema debe calcular automaticamente:

- precio unitario x cantidad = subtotal por producto
- suma de subtotales = total de compra

### Validacion de presupuesto
El sistema debe actualizar en tiempo real:

- total gastado
- presupuesto restante

### Validacion de pago
El sistema debe comprobar:

- si el monto entregado es igual al total
- si el monto entregado es mayor al total
- si el monto entregado es menor al total

### Validacion de cambio
Si el jugador paga de mas, el juego debe mostrar cuanto cambio recibe.

Ejemplo:

- total de compra: $8
- pago realizado: $10
- cambio esperado: $2

### Validacion de reparto
En el nivel 3, el sistema debe comprobar:

- si la cantidad total se reparte por igual
- si el resultado por persona es correcto

## Condiciones de exito
El jugador gana el nivel cuando:

- compra todos los productos requeridos
- selecciona las cantidades correctas
- no supera el presupuesto
- realiza un pago valido
- comprende o acepta correctamente el cambio generado
- resuelve el reparto correctamente en el nivel 3

## Condiciones de error
El jugador debe recibir retroalimentacion cuando:

- falta un producto obligatorio
- la cantidad elegida no coincide con la mision
- supera el presupuesto
- paga menos del total
- responde mal el reparto del nivel 3

## Retroalimentacion al usuario
La retroalimentacion debe ser positiva, clara y orientada al aprendizaje.

Mensajes sugeridos:

- "Muy bien, elegiste los productos correctos."
- "Revisa la cantidad de panes. Necesitas 2."
- "Te falta un producto de la lista."
- "Te pasaste del presupuesto. Intenta otra vez."
- "Buen trabajo, pagaste correctamente."
- "Pagaste de mas. Debes recibir $2 de cambio."
- "Muy bien, cada persona recibe 2 manzanas."

## Interfaz esperada
La interfaz debe ser:

- colorida
- amigable
- facil de leer
- visualmente atractiva para ninos
- intuitiva para jugar sin demasiadas instrucciones

Elementos recomendados:

- personaje guia Michi Money
- botones grandes
- productos con ilustraciones
- indicadores visibles de dinero y carrito
- controles simples para aumentar o disminuir cantidad
- animaciones breves de acierto
- portada con selector de niveles

## Criterios de aceptacion
La version actual del juego se considera completa si cumple con lo siguiente:

- existe una pantalla de inicio que permite elegir entre 3 niveles
- existe una mision de compra claramente explicada por nivel
- se muestran productos con nombre e imagen
- el jugador puede seleccionar productos y ajustar cantidades
- el sistema calcula subtotales automaticamente
- el sistema calcula el total automaticamente
- el sistema controla el presupuesto maximo
- el jugador puede pagar con monedas y billetes
- el sistema valida el pago y el cambio
- el juego entrega retroalimentacion final clara
- el nivel 3 agrega un reto simple de division o reparto al completar la compra

## Arquitectura recomendada
Tomando como referencia las imagenes que compartiste, la arquitectura recomendada para este proyecto es una combinacion de:

- FSD para organizar el proyecto por capas y funcionalidad
- Arquitectura hexagonal para separar la logica del juego de la interfaz
- Atomic Design para construir una UI reutilizable y consistente

## Stack recomendado
- Next.js con React para las pantallas
- JavaScript para la logica del juego
- Tailwind CSS para estilos
- Framer Motion para animaciones
- Zustand o estado local con useReducer para el estado del juego

## Por que esta arquitectura encaja bien
FSD ayuda a mantener el proyecto ordenado por modulos del juego.
Hexagonal permite que las reglas del mercado, el carrito, el presupuesto y el pago no dependan directamente de la UI.
Atomic Design ayuda a crear botones, tarjetas, paneles y layouts reutilizables para futuras misiones o minijuegos.

## Estructura base sugerida
```text
src/
  app/
    page.jsx
    mission/page.jsx
    market/page.jsx
    checkout/page.jsx
    result/page.jsx
  widgets/
  features/
    market-game/
  entities/
    product/
    mission/
    wallet/
  shared/
    ui/
    lib/
    config/
```

## Recomendacion de implementacion
Para este proyecto no hace falta usar un motor de videojuegos al inicio. La experiencia se puede resolver muy bien como aplicacion interactiva con logica de juego.

La recomendacion concreta es:

- usar Next.js + React para pantallas
- usar FSD para ordenar el proyecto
- usar Hexagonal en la feature principal del juego
- usar Atomic Design en shared/ui

## Resumen funcional
**El Mercado de los Suenos** consiste en ayudar a Michi Money a completar distintas compras dentro de presupuestos limitados. El jugador elige un nivel, selecciona productos correctos, controla cantidades, aplica multiplicacion en subtotales, calcula cuanto gasta, paga adecuadamente y, en el nivel 3, realiza un reparto simple. La experiencia busca ensenar matematicas de forma practica, visual y entretenida.
