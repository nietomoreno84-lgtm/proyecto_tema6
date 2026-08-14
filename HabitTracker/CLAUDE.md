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
  - "formatear": convierten una fecha a texto (formatearFechaISO,
    formatearFechaLarga)
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
  un campo nuevo (ver la migración de `categoria` ausente a `"Mente"` y de
  `fechasCompletadas` ausente/no-array a `[]`); aplicar el mismo patrón si el
  modelo cambia otra vez.
- `cargarHabitos()` también debe seguir siendo resistente a datos rotos o del
  formato anterior: JSON inválido en `habitTracker_data` (try/catch alrededor
  de `JSON.parse`, devolviendo `[]` en vez de romper toda la app) y el formato
  antiguo en array plano (antes de envolver en `{ habits: [...] }`), detectado
  con `Array.isArray(parseado)` para no perder esos datos silenciosamente al
  siguiente `guardarHabitos()`. Encontrado por el subagente `bugs-logica`
  (ver RESUMEN_PROYECTO.md).

## Hallazgos de convenciones/calidad aplicados (2026-08-14)
Tras la ronda de subagentes en paralelo (ver RESUMEN_PROYECTO.md sección 10),
se aplicaron los 8 hallazgos de `convenciones` y `calidad` que habían quedado
pendientes:
- Renombradas `crearPuntitosSemana` → `renderizarPuntitosSemana` y
  `actualizarFechaHeader` → `renderizarFechaHeader`: ambas pintan el DOM, así
  que llevan el prefijo `renderizar` en vez de `crear`/`actualizar`. Por la
  misma razón, la nueva función extraída de `renderizarHabitos` se llamó
  `renderizarTarjetaHabito` (no `crearTarjetaHabito`, que fue el nombre que
  propuso el subagente `calidad` pero rompía esta misma convención).
- `aplicarFiltro` ahora llama a `renderizarTodo()` en vez de renderizar
  parcialmente (`renderizarHabitos` + `renderizarResumen`), respetando el
  patrón de único punto de entrada tras cualquier cambio de estado visible.
- Generalizado el bucle de "últimos N días" en `obtenerUltimosNDias(n)`
  (devuelve objetos `Date`); `obtenerUltimos7Dias()` y el bucle de 14 días de
  `renderizarHistorial` lo reutilizan en vez de duplicar la lógica.
- `renderizarVistaSemanal` dividida en `renderizarCabeceraSemanal` y
  `renderizarCuerpoSemanal`.
- Creada la variable `--radio-borde-sm: 6px` en `:root` y sustituidos los 5
  `border-radius: 6px` que estaban hardcodeados en `styles.css`.
- Documentado en un comentario por qué `cargarHabitos()` migra `categoria`
  ausente a `"Mente"` (dato guardado antes de que ese campo existiera).

## Tests (2026-08-14)
Siguiente paso del temario tras la revisión con subagentes: generación
automática de tests. Dado que el proyecto prohíbe `npm` y dependencias
externas (ver Restricciones importantes), no se usó pytest/Jest/etc.: se
construyó un mini framework de aserciones propio, en JS vainilla, que corre
en el navegador sin instalar nada.
- `tests/test-runner.js`: funciones `test(nombre, fn)`, `assertIgual`,
  `assertVerdadero`, `conStorageLimpio` (aísla cada test que toca
  `localStorage`, limpiándolo antes y después) y `mostrarResultadosTests()`.
- `tests/tests-app.js`: 33 tests sobre las funciones de `js/app.js` (30
  originales + 3 añadidos por el equipo de agentes, ver sección "Equipos de
  agentes") —
  unitarios (fechas, rachas, mejor racha, filtro por categoría, modelo),
  de regresión (los 3 bugs de `cargarHabitos()` corregidos en `ec6d543`:
  JSON inválido, formato antiguo en array plano, `fechasCompletadas`
  ausente) y de integración (`guardarHabitos`/`cargarHabitos` con
  `localStorage` real, `toggleFecha`, `eliminarHabito`).
- `tests/tests.html`: carga `../js/app.js` + el runner + la suite. Incluye
  un esqueleto oculto con los mismos IDs que `index.html` para que
  `inicializar()` no falle al no encontrar elementos; los tests no dependen
  de ese esqueleto, solo evita errores al cargar la página.
- **app.js es un script clásico sin `export`/`module.exports`** (se carga
  con `<script defer>`, no como módulo): sus funciones declaradas con
  `function` quedan en el ámbito global, así que `tests-app.js` puede
  llamarlas directamente sin tocar `app.js` para hacerlo "testeable".
- **Bug real encontrado por los tests** (no por revisión manual): `crearHabito`
  generaba `id: Date.now().toString()`, que colisiona si se crean dos hábitos
  en el mismo milisegundo — el test
  `eliminarHabito_quita_solo_ese_habito_de_storage` lo detectó porque
  `eliminarHabito` borraba ambos hábitos con id repetido en vez de solo uno.
  Corregido añadiendo un sufijo aleatorio al id (`Date.now().toString(36) +
  Math.random().toString(36).slice(2, 9)`). Ejemplo real de por qué generar
  tests exhaustivos vale la pena incluso en código ya revisado por subagentes.
- Cómo ejecutar: servir `HabitTracker/` con un servidor local y abrir
  `tests/tests.html` (ver README.md). Los resultados se pintan en la página
  y se imprimen también en consola.

## Documentación técnica generada (2026-08-14)
Siguiente paso del temario tras los tests: generación automática de
documentación a partir del código y el historial real (no texto genérico).
Adaptado a que este proyecto no tiene versiones/tags ni una API pública:
- `CHANGELOG.md`: generado leyendo `git log` completo (no hay tags, así que
  cubre desde el inicio del proyecto bajo `[Sin publicar]`), en formato
  Keep a Changelog (Added/Changed/Fixed/Removed). Curado a nivel de
  funcionalidad: se excluyeron los commits que documentan el propio proceso
  de construcción (esos quedan en `RESUMEN_PROYECTO.md`), porque un
  changelog es para quien usa la app, no para el making-of.
- `docs/GUIA_USUARIO.md`: sustituye a "documentación de API" por lo que sí
  tiene sentido aquí — una guía para usuarios sin perfil técnico, sin jerga
  (nada de "localStorage", "DOM", etc., todo en términos de "se guarda en
  este ordenador").
- `docs/REFERENCIA_FUNCIONES.md`: la adaptación real de "documentación de
  API" — no hay endpoints ni funciones públicas exportadas (`app.js` es un
  script clásico sin `export`), así que se documentaron las ~30 funciones
  internas (parámetros, valor de retorno, notas, ejemplos donde aporta).
  Se dejó en un archivo aparte, no como docstrings dentro de `app.js`, para
  no romper la convención de comentarios mínimos del proyecto.
- README.md actualizado con una sección "Documentación" que enlaza los
  cuatro documentos (README, CHANGELOG, guía de usuario, referencia de
  funciones, más CLAUDE.md y RESUMEN_PROYECTO.md) y el árbol de carpetas
  con `docs/` y `CHANGELOG.md`.
- **Hook de auto-actualización de docs configurado** (2026-08-14, con
  confirmación explícita del usuario): `.claude/settings.json` en la raíz
  del repo (`C:\proyecto_tema6\.claude\`, no dentro de `HabitTracker/`,
  porque ahí es donde vive `.claude/` en este proyecto) tiene un hook
  `PostToolUse` sobre `Edit` con `"if": "Edit(HabitTracker/js/app.js)"` que
  lanza `claude -p '...' --allowedTools Read,Edit` para mantener
  `docs/REFERENCIA_FUNCIONES.md` sincronizado con `app.js` cada vez que se
  edita. Se probó sustituyendo temporalmente el comando por uno que escribe
  un centinela en `/tmp`, disparando una edición trivial y reversible sobre
  `app.js`: el hook se ejecutó correctamente antes de restaurar el comando
  real (no se hizo una prueba con el `claude -p` real para no gastar una
  invocación anidada solo para verificar). El matcher usa la sintaxis
  correcta de este esquema de hooks (`matcher` = nombre de herramienta,
  `if` = patrón de ruta), no el `matcher: "Edit(ruta)"` combinado que
  mostraba el ejemplo del temario.

## Agent Skills del proyecto (2026-08-14)
Siguiente tema del temario tras subagentes/hooks: diferencia entre
subagentes (contexto aislado, resultado como resumen) y Agent Skills
(conocimiento/flujo de trabajo cargado en la sesión principal, sin aislar
contexto). Se crearon dos skills en `.claude/skills/` (raíz del repo, junto
a `.claude/agents/`) para flujos que ya se repetían sesión tras sesión:
- `probar-en-navegador`: encapsula el flujo probado de servir
  `HabitTracker/` por HTTP local (nunca `file://`, claude-in-chrome no lo
  permite), abrir la página con claude-in-chrome, revisar la consola sin
  errores y cerrar todo al terminar. Acepta como argumento la ruta a abrir
  (`index.html` por defecto, o `tests/tests.html`) y, opcionalmente, qué
  interacción concreta verificar.
- `revision-habittracker`: lanza en paralelo los 5 subagentes de
  `.claude/agents/` (`code-reviewer`, `bugs-logica`, `seguridad`,
  `convenciones`, `calidad`), consolida los hallazgos agrupados por
  severidad y NO aplica fixes automáticamente — pregunta al usuario, igual
  que se ha hecho en las rondas de revisión anteriores de este proyecto.
- **Confirmado en la misma sesión en que se crearon**: `probar-en-navegador`
  y `revision-habittracker` aparecieron disponibles como skills invocables
  sin reiniciar sesión (igual que pasó con los 4 subagentes nuevos — ver
  [[feedback_subagentes_manual]] sobre lo no determinista de esta
  detección; con skills, en esta ocasión, funcionó de inmediato).

## Equipos de agentes (experimental, 2026-08-14)
Siguiente tema del temario tras Agent Skills. Requiere Claude Code v2.1.32+
(esta instalación: 2.1.232, cumple) y la variable de entorno
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. El texto del temario dice que está
"disponible en los planes Max"; el usuario confirmó tener plan **Pro**, no
Max — se activa igualmente a modo de prueba (reversible, sin riesgo), con
el acuerdo explícito de revertirlo si no funciona.
- Añadida a `.claude/settings.json` → `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"`.
- **Pendiente de comprobar**: como con el hook de `PostToolUse` (ver más
  abajo) y como con las variables de entorno en general, este flag se lee
  al arrancar la sesión — no tiene efecto hasta reiniciar Claude Code.
  Comprobar en la próxima sesión si la funcionalidad de equipos aparece
  disponible; si el plan Pro no la soporta, revertir quitando la variable
  de `.claude/settings.json`.
- HabitTracker es un proyecto pequeño (un HTML, un CSS, un JS): el caso de
  uso fuerte de equipos de agentes es dividir trabajo en módulos
  independientes que no se bloqueen entre sí — aquí no hay tanta superficie
  para ese paralelismo. La skill `revision-habittracker` ya cubre un
  patrón equivalente (lanzar varios subagentes en paralelo y consolidar),
  solo que orquestado manualmente por el asistente principal en vez de por
  un subagente líder delegado.

## Equipos de agentes — prueba real (2026-08-14)
Siguiente tema del temario tras Agent Skills. Confirmado que con
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` (ver sección anterior) el plan
**Pro** sí expone la infraestructura de equipos: `SendMessage`, `TaskList`,
`TaskCreate`, `TaskUpdate` y `TaskStop` mencionan explícitamente
"teammate"/"team-lead"/`"name@team"`, y los agentes lanzados con el tool
`Agent` pasaron a ejecutarse **en segundo plano** (notificación asíncrona al
terminar) en vez de bloquear la conversación como antes.

Prueba realizada, calcada del diagrama del temario (seguridad + tests +
documentador, coordinados por un líder):
1. Se crearon 3 tareas en el `TaskList` compartido: auditoría de seguridad
   de `js/app.js` (#1), tests nuevos en `tests/tests-app.js` (#2, en
   paralelo con la #1 — ámbitos de archivo distintos, sin conflicto) y
   documentar en `CHANGELOG.md` (#3, bloqueada por #1 y #2 porque depende
   de sus resultados — no se paralelizó, siguiendo la advertencia del
   propio temario sobre tareas que se bloquean entre sí).
2. **Seguridad**: sin hallazgos (coincide con la ronda de seguridad
   anterior). **Tests**: 3 casos nuevos añadidos cerrando huecos reales de
   cobertura (`formatearFechaLarga` no tenía ningún test;
   `toggleCompletado` solo se probaba indirectamente vía `toggleFecha`; el
   handler `manejarClickBorrarDatos` no tenía cobertura — mockeando
   `window.confirm`). **Documentador**: resumió los tests nuevos en
   `CHANGELOG.md` → `Added`, y decidió (criterio editorial propio, no
   instruido explícitamente) NO añadir línea sobre la auditoría de
   seguridad por no tener hallazgos nuevos que aportar a un changelog
   orientado a usuario — mismo criterio que ya excluye documentación de
   proceso interno.
3. Verificado por el coordinador (no por los agentes) ejecutando
   `tests/tests.html` vía servidor local: **33/33 tests en verde**, sin
   errores de consola inesperados.
4. **Detalle técnico**: ni el agente de tests ni el documentador tenían
   `TaskUpdate` en su toolset (solo `SendMessage` a `"main"`), así que el
   coordinador tuvo que marcar las tareas #2 y #3 como completadas
   manualmente al recibir sus resúmenes.

**Cómo aplicar**: para tareas verdaderamente independientes con ámbitos de
archivo separados, lanzar los agentes en paralelo (varias llamadas a
`Agent` en el mismo mensaje) y dejar que se ejecuten en segundo plano;
para una tarea que depende del resultado de otras, esperar su notificación
y pasarle el contexto explícitamente en el prompt (los compañeros no
heredan el historial de la sesión principal). Siempre verificar el
resultado real (leer el diff, ejecutar los tests) en vez de fiarse del
resumen que devuelve cada agente.

## Práctica final del curso: documentación (2026-08-14)
Ejercicio de evaluación sobre los tres documentos ya generados en el tema
de documentación técnica. Checklist del enunciado (README con descripción,
requisitos, instalación, uso con ejemplos reales, estructura y licencia;
guía de usuario; documentación técnica de funciones; reflexión comparando
los tres) contrastado contra lo ya hecho:
- Faltaban explícitamente **Requisitos**, **Instalación** y **Licencia**
  en el README — añadidos. Licencia decidida con el usuario: **MIT**
  (archivo `LICENSE` nuevo en la raíz de `HabitTracker/`).
- Verificado con `diff` de funciones (`grep` de `^function` en `app.js`
  contra los headers `### \`nombre\`` de `REFERENCIA_FUNCIONES.md`): 34/34
  funciones coinciden exactamente en ambas direcciones, sin huecos ni
  documentación de funciones que ya no existen — confirma que el documento
  sigue generado desde el código real, no genérico.
- Añadido `docs/REFLEXION_DOCUMENTACION.md`: comparativa breve (el
  enunciado pide "breve reflexión") de qué documento sirve a qué público
  y qué mejorar en una segunda iteración. Primera versión salió demasiado
  larga; se recortó tras feedback del usuario para ajustarse al "breve"
  del enunciado sin perder la especificidad del proyecto real (a
  diferencia del ejemplo de solución del curso, que usaba un proyecto
  Python genérico de referencia).

## Restricciones aprendidas durante el proyecto
- NUNCA hardcodear un color o valor de espaciado en styles.css: si no existe
  la variable en :root, crearla primero (pasó dos veces con --color-danger
  antes de corregirlo).
- Las acciones destructivas (eliminar un hábito, borrar todos los datos) piden
  confirmación con window.confirm() antes de ejecutarse.
- Elementos interactivos solo con icono (puntitos, botón "×" de eliminar) y el
  checkbox de "completado hoy" (sin texto propio asociado) llevan aria-label;
  los inputs de texto llevan estilo de :focus visible.
- Antes de retomar una sesión, correr git status/git diff primero: dos
  sesiones de este proyecto terminaron con cambios sin commitear que había
  que detectar antes de asumir que el árbol estaba limpio.
- NUNCA usar `new Date().toISOString().split('T')[0]` para obtener una fecha
  en formato "YYYY-MM-DD": `toISOString()` da la fecha en UTC, mientras que el
  resto de la UI (cabecera, etc.) usa hora local, lo que desalineaba "hoy"
  cerca de medianoche en husos horarios positivos (bug encontrado por el
  subagente code-reviewer). Usar siempre `formatearFechaISO(fecha)`, que
  construye la fecha con los componentes locales (getFullYear/getMonth/
  getDate).

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
