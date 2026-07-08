# Guia de Subida al Repo y Despliegue en Vercel

## Ruta local del proyecto
El proyecto esta en:

`C:\Users\usuario\Documents\El Mercado de los Sueños-Juego`

## Antes de subir
Ejecutar:

```bash
pnpm lint
pnpm verify:logic
pnpm build
```

## Subir al repositorio
Ejemplo de flujo:

```bash
git init
git add .
git commit -m "feat: juego base mercado de los suenos"
git branch -M main
git remote add origin <URL_DEL_REPO>
git push -u origin main
```

Si el repositorio ya existe y solo falta subir cambios:

```bash
git add .
git commit -m "feat: avance del mini juego"
git push
```

## Despliegue en Vercel
1. Entrar a Vercel.
2. Seleccionar `Add New Project`.
3. Importar el repositorio.
4. Vercel detecta automaticamente `Next.js`.
5. Confirmar que el comando de install sea `pnpm install`.
6. Confirmar que el comando de build sea `pnpm build`.
7. Confirmar que el directorio de salida quede con la configuracion por defecto de Next.js.
8. Desplegar.

## Configuracion esperada en Vercel
- Framework Preset: `Next.js`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Output Directory: automatico

## Revision despues del despliegue
Verificar en produccion:
- carga de la home
- flujo de mision
- seleccion de cantidades en mercado
- validacion de compra correcta
- bloqueo por producto extra
- bloqueo por presupuesto excedido
- pago insuficiente
- pago con cambio
- activacion y desactivacion de sonido

## Nota
El proyecto no depende de fuentes remotas ni de assets externos para el sonido, lo que ayuda a que el despliegue sea mas estable.
