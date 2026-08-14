# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Este proyecto todavía no usa versiones ni tags de Git (no es una librería que
otros instalen), así que los cambios se agrupan bajo **Sin publicar** en
orden cronológico inverso. Generado a partir del historial real de `git log`,
curado a nivel de funcionalidad: se omiten los commits que documentan el
propio proceso de construcción (ver `RESUMEN_PROYECTO.md` para ese detalle)
y se agrupan varios commits pequeños bajo una misma entrada cuando describen
el mismo cambio visible.

## [Sin publicar] - 2026-08-14

### Added
- Aplicación de seguimiento de hábitos con cuatro pestañas: Hoy, Historial,
  Gráficos y Configuración.
- Alta y baja de hábitos personalizados, con nombre y categoría (Mente,
  Cuerpo, Salud).
- Marcado de hábitos completados por día mediante checkbox, y puntitos
  clicables de los últimos 7 días para marcar/desmarcar cualquier día (no
  solo hoy).
- Cálculo de racha actual y "mejor racha" entre todos los hábitos.
- Resumen diario de completados con barra de progreso, filtrable por
  categoría.
- Vista semanal en tabla (pestaña Historial): últimos 7 días como columnas,
  hábitos como filas.
- Historial detallado de los últimos 14 días.
- Gráficos de cumplimiento semanal por hábito, construidos con HTML/CSS
  puro (barras), sin librerías de charting.
- Confirmación antes de eliminar un hábito individual o de borrar todos los
  datos guardados.
- Suite de tests propia sin dependencias externas (`tests/`): 30 casos
  unitarios, de regresión y de integración sobre la lógica de `js/app.js`,
  ejecutables abriendo `tests/tests.html` en el navegador.
- Ampliada la suite de tests con 3 casos más, cerrando huecos de cobertura
  reales: formateo de fecha larga, marcado/desmarcado del día actual desde
  la propia UI (no solo la función interna de toggle) y el handler de
  "Borrar datos" con `window.confirm` simulado.
- Documentación del proyecto: `README.md`, `CLAUDE.md` (especificación y
  convenciones), y esta misma guía (`CHANGELOG.md`).

### Changed
- Esquema de almacenamiento en `localStorage` ajustado a
  `{ "habits": [...] }` bajo la clave `habitTracker_data` (antes, un array
  plano de hábitos sin envolver).
- CSS refactorizado para usar variables en `:root` (colores, espaciados,
  radios de borde) en vez de valores sueltos repetidos por el archivo.
- Varias funciones de `js/app.js` renombradas para seguir de forma
  consistente las convenciones internas de prefijos (`renderizar` para
  funciones que pintan el DOM, `crear` solo para construir objetos del
  modelo, `obtener`/`calcular` para funciones puras).

### Fixed
- Pluralización incorrecta de "racha" (mostraba "1 días" en vez de "1 día").
- Cálculo de "mejor racha": medía la racha histórica más larga en vez de la
  racha activa hasta hoy, que es el comportamiento pretendido.
- La fecha de "hoy" se calculaba en UTC (`toISOString()`) mientras el resto
  de la interfaz usa hora local, lo que desalineaba el checkbox de
  completado y las rachas cerca de medianoche en husos horarios como el de
  España.
- `cargarHabitos()` no manejaba JSON corrupto en `localStorage` (rompía toda
  la aplicación), ni hábitos guardados en el formato antiguo (array plano
  antes del envoltorio `{ habits: [...] }`) o sin el campo
  `fechasCompletadas`, lo que podía perder datos de forma silenciosa.
- `crearHabito()` generaba el `id` únicamente con `Date.now()`, que podía
  colisionar si se creaban dos hábitos en el mismo milisegundo; al
  eliminarse uno, se perdían ambos por compartir el mismo identificador.

### Removed
- Nada eliminado todavía: no ha habido funcionalidades retiradas desde el
  inicio del proyecto.
