---
name: revision-habittracker
description: Lanza en paralelo los 5 subagentes de revisión de HabitTracker (code-reviewer, bugs-logica, seguridad, convenciones, calidad) sobre el estado actual del código y consolida sus hallazgos. Úsalo tras terminar un bloque grande de cambios en HabitTracker, o cuando el usuario pida "revisa el código" / "pasa los subagentes".
---

Ejecuta una ronda completa de revisión de `HabitTracker/` (`index.html`,
`css/styles.css`, `js/app.js`) usando los subagentes ya definidos en
`.claude/agents/`, cada uno con un único foco y sin ver el trabajo de los
demás (así se han validado en este proyecto — ver `CLAUDE.md`).

Pasos:

1. Lanza estos 5 subagentes **en un único mensaje, en paralelo** (una
   llamada a `Agent` por subagente, todas en el mismo turno):
   - `code-reviewer` — revisión general de convenciones/bugs/seguridad/
     accesibilidad.
   - `bugs-logica` — errores de lógica y casos límite no manejados.
   - `seguridad` — XSS, credenciales expuestas, patrones inseguros.
   - `convenciones` — cumplimiento de las convenciones documentadas en
     `HabitTracker/CLAUDE.md`.
   - `calidad` — complejidad innecesaria, duplicación, funciones largas.

   Dale a cada uno un prompt corto y autocontenido: que revise el estado
   actual de `HabitTracker/` centrado solo en su área, sin asumir contexto
   de la conversación (los subagentes no heredan el historial).

2. Cuando todos hayan terminado, consolida los hallazgos en una única
   respuesta, agrupados por subagente, distinguiendo claramente:
   - **Críticos** (bugs reales, huecos de seguridad): repórtalos primero.
   - **Menores** (convenciones, calidad/mantenibilidad): repórtalos aparte.

3. **No apliques ningún fix automáticamente.** Presenta los hallazgos y
   pregunta al usuario cuáles quiere corregir ahora — el patrón seguido en
   este proyecto es corregir los críticos con confirmación explícita y
   dejar documentados los menores (en `CLAUDE.md` o `RESUMEN_PROYECTO.md`)
   para una pasada posterior si el usuario lo pide.

4. Si el usuario pide aplicar correcciones, síguelas con el flujo habitual
   del proyecto: editar, probar en navegador (puedes usar la skill
   `probar-en-navegador`), commit en español por tipo de cambio, y
   confirmar antes de hacer push.
