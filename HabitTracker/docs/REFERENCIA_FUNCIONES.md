# Referencia de funciones — js/app.js

Documentación técnica de todas las funciones de `js/app.js`, agrupadas en
los mismos bloques en los que están organizadas dentro del propio archivo
(ver la convención "Organización del archivo" en `CLAUDE.md`).

Este documento vive aparte del código a propósito: la convención del
proyecto es no comentar lo obvio dentro de `app.js` (los nombres de función
ya siguen un prefijo consistente — `cargar`/`guardar`, `crear`,
`obtener`/`calcular`, `formatear`, `renderizar`, `manejar` — que hace
innecesario un docstring por función en el propio archivo). Aquí sí se
detalla parámetro a parámetro para quien necesite ese nivel de detalle sin
tener que leer la implementación.

Ninguna de estas funciones se exporta (`app.js` es un script clásico, no un
módulo): todas quedan en el ámbito global de la página mientras `app.js`
esté cargado.

## Almacenamiento

### `cargarHabitos()`
Lee `localStorage` y devuelve la lista de hábitos guardados.

- **Parámetros**: ninguno.
- **Devuelve**: `Array<Habito>`. Array vacío si no hay datos guardados o si
  el contenido de `localStorage` es JSON inválido.
- **Notas**: tolera y migra datos antiguos o incompletos sin lanzar
  excepciones: JSON corrupto (`try/catch` alrededor de `JSON.parse`),
  formato antiguo en array plano (antes del envoltorio `{ habits: [...] }`,
  detectado con `Array.isArray`), hábitos sin `categoria` (se asume
  `'Mente'`) y sin `fechasCompletadas` (se asume `[]`).

### `guardarHabitos(habitos)`
Persiste la lista de hábitos en `localStorage`.

- **Parámetros**: `habitos` (`Array<Habito>`) — la lista completa a guardar
  (sustituye por completo lo que hubiera antes).
- **Devuelve**: nada.
- **Notas**: siempre envuelve el array en `{ habits: habitos }` antes de
  serializarlo, bajo la clave `habitTracker_data`.

## Modelo

### `crearHabito(nombre, categoria)`
Construye un objeto de hábito nuevo, sin guardarlo.

- **Parámetros**:
  - `nombre` (`string`) — nombre visible del hábito.
  - `categoria` (`string`) — una de `'Mente'`, `'Cuerpo'`, `'Salud'`.
- **Devuelve**: `Habito` — `{ id, nombre, categoria, creadoEn, fechasCompletadas: [] }`.
- **Notas**: `id` combina `Date.now()` en base 36 con un sufijo aleatorio
  para evitar colisiones si se crean dos hábitos en el mismo milisegundo.
  `fechasCompletadas` es siempre un array nuevo (no se comparte entre
  llamadas).
- **Ejemplo**:
  ```js
  const habito = crearHabito('Beber agua', 'Salud');
  // { id: 'm3x1a2b-f8d21', nombre: 'Beber agua', categoria: 'Salud',
  //   creadoEn: '2026-08-14T18:03:00.000Z', fechasCompletadas: [] }
  ```

## Fechas / Utilidades

### `formatearFechaISO(fecha)`
Convierte un `Date` a texto `YYYY-MM-DD` usando componentes **locales** (no
UTC).

- **Parámetros**: `fecha` (`Date`).
- **Devuelve**: `string` con formato `YYYY-MM-DD`.
- **Notas**: es la única función que debe usarse para obtener la fecha de
  "hoy" en este formato; `toISOString()` da la fecha en UTC y desalinea la
  app cerca de medianoche en husos horarios positivos (ver `CLAUDE.md`).

### `obtenerFechaHoy()`
Atajo para la fecha de hoy en formato ISO local.

- **Parámetros**: ninguno.
- **Devuelve**: `string` (`YYYY-MM-DD`), equivalente a
  `formatearFechaISO(new Date())`.

### `obtenerUltimosNDias(n)`
Genera los últimos `n` días como objetos `Date`, en orden ascendente,
terminando hoy.

- **Parámetros**: `n` (`number`) — cuántos días generar.
- **Devuelve**: `Array<Date>`, longitud `n`. El último elemento es siempre
  hoy.
- **Ejemplo**:
  ```js
  obtenerUltimosNDias(3).map(formatearFechaISO);
  // ['2026-08-12', '2026-08-13', '2026-08-14']
  ```

### `obtenerUltimos7Dias()`
Como `obtenerUltimosNDias(7)`, pero ya convertido a fechas ISO (`string`).

- **Parámetros**: ninguno.
- **Devuelve**: `Array<string>`, longitud 7.

### `formatearFechaLarga(fecha, conAnio)`
Formatea una fecha en texto largo en español, para cabeceras y el
historial.

- **Parámetros**:
  - `fecha` (`Date`).
  - `conAnio` (`boolean`) — `true` da formato `"viernes, 14 de agosto · 2026"`
    (cabecera principal); `false` da formato `"Hoy, viernes, 14 de agosto"`
    (subtítulo de la pestaña Hoy).
- **Devuelve**: `string`.

## Lógica

### `toggleFecha(id, fecha)`
Marca o desmarca un hábito como completado en una fecha concreta, guarda el
cambio y vuelve a pintar toda la interfaz.

- **Parámetros**:
  - `id` (`string`) — id del hábito.
  - `fecha` (`string`, `YYYY-MM-DD`) — el día a marcar/desmarcar (no tiene
    que ser hoy: así funcionan los puntitos de la semana).
- **Devuelve**: nada. Si no existe un hábito con ese `id`, no hace nada.

### `toggleCompletado(id)`
Igual que `toggleFecha`, pero fijado siempre al día de hoy. Es lo que llama
el checkbox de "completado hoy" de cada tarjeta.

- **Parámetros**: `id` (`string`).
- **Devuelve**: nada.

### `eliminarHabito(id)`
Borra un hábito (y su historial) de forma permanente.

- **Parámetros**: `id` (`string`).
- **Devuelve**: nada. No pide confirmación por sí misma — quien la llama
  (`manejarClickEnLista`) es responsable de confirmar con el usuario antes.

### `calcularRachaActual(habito)`
Cuenta cuántos días **consecutivos hasta hoy** lleva completado un hábito.

- **Parámetros**: `habito` (`Habito`).
- **Devuelve**: `number` (`>= 0`).
- **Notas**: es la racha *actual*, no la histórica más larga — si hoy no
  está completado, devuelve 0 aunque el hábito tenga una racha larga en el
  pasado (decisión de producto documentada en `CLAUDE.md`).

### `obtenerMejorRacha(habitos)`
Encuentra, de entre varios hábitos, el que tiene la racha actual más alta.

- **Parámetros**: `habitos` (`Array<Habito>`).
- **Devuelve**: `{ racha: number, nombre: string }`. Con lista vacía o con
  todas las rachas en 0, devuelve `{ racha: 0, nombre: '' }`.

## UI / Render: Hoy

### `renderizarFechaHeader()`
Pinta la fecha actual en la cabecera y en el subtítulo de la pestaña Hoy.
Sin parámetros ni valor de retorno.

### `renderizarPuntitosSemana(habito)`
Construye (sin insertar en el DOM) el contenedor con los 7 puntitos
clicables de un hábito.

- **Parámetros**: `habito` (`Habito`).
- **Devuelve**: `HTMLDivElement` listo para insertar donde haga falta.

### `obtenerHabitosVisibles(habitos)`
Aplica el filtro de categoría activo (`filtroCategoriaActual`) a una lista
de hábitos.

- **Parámetros**: `habitos` (`Array<Habito>`).
- **Devuelve**: `Array<Habito>` — la lista completa si el filtro es
  `'todos'`, o solo los de esa categoría.

### `renderizarTarjetaHabito(habito, hoy)`
Construye (sin insertar en el DOM) la tarjeta completa de un hábito:
checkbox, nombre, etiqueta de categoría, puntitos semanales y botón de
eliminar.

- **Parámetros**:
  - `habito` (`Habito`).
  - `hoy` (`string`, `YYYY-MM-DD`) — se recibe en vez de recalcularla, para
    no llamar a `obtenerFechaHoy()` una vez por tarjeta.
- **Devuelve**: `HTMLDivElement`.

### `renderizarHabitos()`
Pinta la lista completa de tarjetas de hábitos (filtrada por categoría) en
`#habit-cards`, incluyendo los mensajes de "sin hábitos" o "sin hábitos en
esta categoría". Sin parámetros ni valor de retorno.

### `renderizarResumen()`
Actualiza el contador "completados/total" y la barra de progreso del día,
respetando el filtro de categoría activo. Sin parámetros ni valor de
retorno.

### `renderizarMejorRacha()`
Actualiza el bloque "Mejor racha" de la barra lateral. Sin parámetros ni
valor de retorno.

## UI / Render: Historial

### `renderizarHistorial()`
Pinta el bloque "Últimos 14 días" en `#historial-lista`, un bloque por día
con los hábitos completados ese día. Sin parámetros ni valor de retorno.

## UI / Render: Vista semanal

### `renderizarCabeceraSemanal(cabecera, dias7)`
Pinta la fila de cabecera de la tabla de vista semanal (nombre de columna
"Hábito" + un `<th>` por cada uno de los últimos 7 días).

- **Parámetros**:
  - `cabecera` (`HTMLTableRowElement`) — el `<tr>` de `<thead>` a rellenar.
  - `dias7` (`Array<string>`) — fechas ISO, normalmente el resultado de
    `obtenerUltimos7Dias()`.
- **Devuelve**: nada.

### `renderizarCuerpoSemanal(cuerpo, habitos, dias7)`
Pinta una fila por hábito, con una marca verde en los días completados.

- **Parámetros**:
  - `cuerpo` (`HTMLTableSectionElement`) — el `<tbody>` a rellenar.
  - `habitos` (`Array<Habito>`).
  - `dias7` (`Array<string>`) — fechas ISO, mismas que se usaron en la
    cabecera (para que columnas y datos coincidan).
- **Devuelve**: nada.
- **Ejemplo**:
  ```js
  const dias7 = obtenerUltimos7Dias();
  renderizarCabeceraSemanal(document.getElementById('vista-semanal-cabecera'), dias7);
  renderizarCuerpoSemanal(document.getElementById('vista-semanal-cuerpo'), cargarHabitos(), dias7);
  ```

### `renderizarVistaSemanal()`
Orquesta las dos funciones anteriores: carga hábitos y fechas, y pinta
cabecera + cuerpo de la tabla semanal. Sin parámetros ni valor de retorno.

## UI / Render: Gráficos

### `renderizarGraficos()`
Pinta, para cada hábito, una barra con el porcentaje de cumplimiento de los
últimos 7 días. Sin parámetros ni valor de retorno.

## Render general

### `renderizarTodo()`
Punto de entrada único para refrescar toda la interfaz tras cualquier
cambio de datos: llama en orden a `renderizarHabitos`, `renderizarResumen`,
`renderizarMejorRacha`, `renderizarHistorial`, `renderizarVistaSemanal` y
`renderizarGraficos`. Sin parámetros ni valor de retorno. No hay
actualizaciones parciales del DOM en el proyecto: cualquier mutación pasa
siempre por aquí.

## Tabs

### `cambiarTab(nombreTab)`
Activa la pestaña indicada (clase `.activo` en el botón y en el panel
correspondiente) y desactiva el resto.

- **Parámetros**: `nombreTab` (`string`) — `'hoy'`, `'historial'`,
  `'graficos'` o `'configuracion'` (coincide con `data-tab` de los botones).
- **Devuelve**: nada.

## Filtros

### `aplicarFiltro(categoria)`
Cambia el filtro de categoría activo, actualiza qué botón de filtro se ve
como seleccionado y vuelve a pintar toda la interfaz.

- **Parámetros**: `categoria` (`string`) — `'todos'`, `'Mente'`, `'Cuerpo'`
  o `'Salud'`.
- **Devuelve**: nada.

## Eventos

### `manejarSubmitFormulario(evento)`
Handler del `submit` del formulario "Nuevo hábito". Valida que el nombre no
esté vacío, crea y guarda el hábito, resetea el formulario y repinta todo.

- **Parámetros**: `evento` (`SubmitEvent`).
- **Devuelve**: nada.

### `manejarClickEnLista(evento)`
Handler delegado de clics dentro de `#habit-cards` (un único listener para
todas las tarjetas, en vez de uno por elemento). Distingue si el clic fue
en el botón "×" (pide confirmación y elimina el hábito) o en uno de los
puntitos semanales (alterna esa fecha).

- **Parámetros**: `evento` (`MouseEvent`).
- **Devuelve**: nada.

### `manejarCambioEnLista(evento)`
Handler delegado de `change` dentro de `#habit-cards`: si el cambio viene
del checkbox de "completado hoy", llama a `toggleCompletado`.

- **Parámetros**: `evento` (`Event`).
- **Devuelve**: nada.

### `manejarClickBorrarDatos()`
Handler del botón "Borrar todos los datos" en Configuración: pide
confirmación, borra `localStorage` y repinta todo. Sin parámetros ni valor
de retorno.

### `inicializarEventos()`
Registra todos los listeners de la aplicación una sola vez al arrancar
(pestañas, filtros, formulario, lista de hábitos delegada, botón de borrar
datos). Sin parámetros ni valor de retorno.

## Init

### `inicializar()`
Punto de arranque de la aplicación: pinta la fecha, registra los eventos y
hace el primer render completo. Se ejecuta automáticamente en
`DOMContentLoaded`. Sin parámetros ni valor de retorno.
