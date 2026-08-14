---
name: probar-en-navegador
description: Levanta HabitTracker en un servidor local y lo abre con claude-in-chrome para verificar un cambio, revisando la consola en busca de errores. Úsalo después de editar index.html, css/styles.css o js/app.js, o cuando el usuario pida "pruébalo en el navegador".
---

Verifica HabitTracker en el navegador real siguiendo el flujo ya probado de
este proyecto (ver `HabitTracker/CLAUDE.md`, sección "Flujo de trabajo
probado"). **No intentes abrir `index.html` con `file://`**: la extensión
claude-in-chrome no permite navegar a URLs `file://`, hay que servir la
carpeta por HTTP primero.

Argumentos (`$ARGUMENTS`, opcionales): la ruta relativa a abrir dentro de
`HabitTracker/` (por defecto `index.html`; usa `tests/tests.html` para
ejecutar la suite de tests) y, si aplica, una descripción breve de qué
interacción concreta verificar (por ejemplo "añadir un hábito y marcarlo
completado", "comprobar la vista semanal").

Pasos:

1. Levanta un servidor estático desde `HabitTracker/` en un puerto libre
   (por ejemplo `python -m http.server <puerto>` en segundo plano). No
   reutilices un puerto que ya sepas ocupado por una sesión anterior.
2. Si las herramientas `mcp__claude-in-chrome__*` están diferidas, cárgalas
   con `ToolSearch` (`tabs_context_mcp`, `navigate`, `computer`,
   `read_console_messages`, `tabs_create_mcp`, `tabs_close_mcp` como
   mínimo).
3. Obtén el contexto de pestañas y crea una nueva pestaña para esta
   verificación (no reutilices pestañas de otra sesión).
4. Navega a `http://localhost:<puerto>/<ruta>` (la ruta de `$ARGUMENTS`, o
   `index.html` por defecto).
5. Si `$ARGUMENTS` describe una interacción concreta, realízala con
   `computer` (usa `browser_batch` para encadenar varias acciones en una
   sola llamada) y toma una captura para confirmar visualmente el
   resultado.
6. Lee la consola con `read_console_messages` (con `onlyErrors: true` o un
   `pattern` ajustado) y confirma que no hay errores no esperados. Si el
   objetivo es `tests/tests.html`, además reporta el resumen
   "TESTS: N pasados, M fallados" que imprime la propia suite.
7. Si algo fallo aparece cacheado (el navegador sirve una versión antigua
   de un `.js`/`.css` recién editado), haz un hard reload (`ctrl+shift+r`)
   antes de concluir que el fix no funcionó.
8. Cierra la(s) pestaña(s) que hayas creado y detén el servidor local antes
   de terminar.
9. Informa en un par de frases: qué se probó, si hubo errores de consola, y
   el resultado de la interacción o de los tests.
