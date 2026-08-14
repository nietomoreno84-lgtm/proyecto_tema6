# HabitTracker — CLAUDE.md

## Descripción del proyecto
HabitTracker es una aplicación web de una sola página para seguimiento
de hábitos diarios. Permite añadir y eliminar hábitos personalizados
(con nombre y categoría), marcarlos como completados cada día y ver
su progreso mediante puntitos semanales, rachas y estadísticas.
La app se organiza en 4 pestañas: Hoy, Historial, Gráficos y
Configuración. Es una herramienta personal, sin autenticación ni
servidor.

## Tecnologías
- HTML5 semántico
- CSS3 (variables de color, Flexbox, Grid)
- JavaScript vanilla (ES6+), sin frameworks ni librerías externas
  (incluidos los gráficos: se construyen con HTML/CSS puro, sin
  librerías de charting)
- localStorage para persistencia de datos en el navegador

## Estructura de carpetas
HabitTracker/
├── index.html        # Página principal (única)
├── css/
│   └── styles.css    # Todos los estilos
├── js/
│   └── app.js         # Toda la lógica de la aplicación
└── README.md         # Generado al final del proyecto

## Convenciones de código
- Nombres de variables y funciones en camelCase
- Comentarios en español
- CSS con variables definidas en :root para colores y tipografía
- Sin dependencias externas: todo debe funcionar abriendo index.html
  directamente en el navegador (sin servidor local)
- Funciones pequeñas con una sola responsabilidad

## Paleta de colores
- Verde principal: #4CAF50
- Verde oscuro: #388E3C
- Fondo claro: #F9FAFB
- Texto principal: #1F2937
- Bordes: #E5E7EB

## Categorías de hábitos
- Mente
- Cuerpo
- Salud

## Estructura de la aplicación (pestañas)
- **Hoy**: pestaña principal. Header con título y fecha actual,
  filtro por categoría, resumen de completados del día, mejor racha,
  lista de hábitos (con puntitos de los últimos 7 días) y formulario
  para añadir hábitos nuevos.
- **Historial**: vista de días anteriores y qué hábitos se completaron
  cada día.
- **Gráficos**: visualización simple (barras construidas con CSS) del
  porcentaje de cumplimiento por hábito.
- **Configuración**: opciones básicas, como borrar todos los datos
  guardados.

## Restricciones importantes
- NO usar React, Vue, Angular ni ningún framework JS
- NO usar npm ni instalar dependencias
- NO usar librerías externas de gráficos: las estadísticas visuales
  se construyen con HTML/CSS puro
- NO requerir servidor local para funcionar
- NO implementar autenticación ni base de datos externa
- El diseño es para escritorio (no responsive para móvil en esta versión)

## Flujo de trabajo
1. Siempre pedir un plan antes de ejecutar tareas grandes
2. Hacer commits en Git al terminar cada iteración
3. Abrir index.html en el navegador para verificar cada cambio

## Convenciones JavaScript (emergieron durante la construcción)
- Prefijos de función por rol, consistentes en todo app.js:
  - "cargar"/"guardar": acceso a localStorage (cargarHabitos, guardarHabitos)
  - "crear": construir un objeto nuevo del modelo (crearHabito)
  - "obtener"/"calcular": funciones puras que derivan datos sin tocar el DOM
    (obtenerFechaHoy, obtenerUltimos7Dias, calcularRachaActual, obtenerMejorRacha)
  - "renderizar": pintan el DOM a partir del estado (renderizarHabitos,
    renderizarHistorial, renderizarVistaSemanal...). renderizarTodo() es el
    único punto de entrada que se llama tras cualquier mutación de datos —
    no hay actualizaciones parciales del DOM.
  - "manejar": handlers de eventos (manejarSubmitFormulario,
    manejarClickEnLista, manejarCambioEnLista)
- El archivo se organiza en bloques con comentarios separadores en este orden:
  CONSTANTES, ALMACENAMIENTO, MODELO, FECHAS/UTILIDADES, LÓGICA,
  UI/RENDER (uno por pestaña), RENDER GENERAL, TABS, FILTROS, EVENTOS, INIT.
- Los listeners se delegan en el contenedor padre (ej. #habit-cards con un solo
  listener de click/change) en vez de añadir un listener por cada elemento
  dinámico. Los elementos dinámicos identifican su hábito/fecha vía
  data-id / data-fecha, nunca vía closures.
- El contenido generado con datos del usuario (nombre del hábito) siempre se
  inserta con textContent o creando el nodo con createElement; innerHTML solo
  se usa con strings estáticos hardcodeados (mensajes de "vacío").

## Convenciones CSS (actualizado tras construcción)
- Modificadores de estado como clase adicional en español, SIN prefijo is-:
  .activo (pestaña/filtro/panel seleccionado), .completado (habit-card,
  punto, marca-dia). Mantener este patrón — no mezclar con is-active/is-completed.
- Nomenclatura por componente: .habit-card, .tag-categoria (+ .tag-mente/
  .tag-cuerpo/.tag-salud como clase adicional), .punto / .marca-dia (puntos de
  días), .btn-primary / .btn-danger, .mensaje-vacio / .mensaje-vacio-card.
- Todo color y espaciado repetido vive en variables de :root (--color-*,
  --espaciado-xs/sm/md/lg/xl, --radio-borde). Esto no se cumplió desde el
  principio: --color-danger (#DC2626) estuvo hardcodeado en 3 sitios distintos
  hasta que se refactorizó (commit 9a0ac58).

## Modelo de datos (confirmado)
- localStorage bajo la clave `"habitTracker_data"`, valor `{ "habits": [...] }`.
- Cada hábito: `{ id, nombre, categoria, creadoEn, fechasCompletadas: [...] }`.
  Los nombres de campo se mantienen en español aunque un ejemplo externo los dé
  en inglés — `categoria` es necesaria para el filtro y no es opcional.
- `cargarHabitos()` debe seguir siendo tolerante a datos antiguos guardados sin
  un campo nuevo (ver la migración de `categoria` ausente a `"Mente"`); aplicar
  el mismo patrón si el modelo cambia otra vez.

## Restricciones aprendidas durante el proyecto
- NUNCA hardcodear un color o valor de espaciado en styles.css: si no existe
  la variable en :root, crearla primero (pasó dos veces con --color-danger
  antes de corregirlo).
- Las acciones destructivas (eliminar un hábito, borrar todos los datos) piden
  confirmación con window.confirm() antes de ejecutarse.
- Elementos interactivos solo con icono (puntitos, botón "×" de eliminar)
  llevan aria-label; los inputs de texto llevan estilo de :focus visible.
- Antes de retomar una sesión, correr git status/git diff primero: dos
  sesiones de este proyecto terminaron con cambios sin commitear que había
  que detectar antes de asumir que el árbol estaba limpio.

## Flujo de trabajo probado
1. Si llega una iteración/spec nueva del profesor, compararla contra el
   código real (no contra lo que dice este CLAUDE.md) para detectar el delta
   real antes de proponer un plan.
2. Pedir plan explícito antes de ejecutar cambios grandes.
3. Ejecutar y verificar sirviendo la carpeta con un servidor local
   (`python -m http.server` o similar) y probando en el navegador — abrir
   index.html directamente por file:// no funciona con claude-in-chrome.
4. Revisar la consola del navegador (sin errores) antes de dar el cambio
   por bueno.
5. Commit en Git en español, claro, uno por cambio de naturaleza distinta
   (ej. doc de README y refactor de CSS van en commits separados aunque se
   hicieran en la misma sesión).
6. Antes de hacer push, confirmar explícitamente con el usuario.
