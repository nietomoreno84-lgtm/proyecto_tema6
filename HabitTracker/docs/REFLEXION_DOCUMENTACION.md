# Reflexión: comparativa de la documentación generada

Práctica final del curso. HabitTracker cuenta con tres documentos generados
con Claude Code a partir del código real:
[`README.md`](../README.md), [`GUIA_USUARIO.md`](GUIA_USUARIO.md) y
[`REFERENCIA_FUNCIONES.md`](REFERENCIA_FUNCIONES.md).

**Más útil para usuarios finales**: `GUIA_USUARIO.md`. Es el único sin
jerga técnica (nunca aparece "localStorage" ni el nombre de una función) y
el único con preguntas frecuentes orientadas a dudas reales de uso ("¿mis
datos se suben a internet?"). El README le sobra en su mayor parte
(esquema de datos, estructura de carpetas no le interesan a quien solo
quiere marcar un hábito).

**Más útil para perfiles técnicos**: `REFERENCIA_FUNCIONES.md`. Documenta
cada una de las ~30 funciones de `app.js` con parámetros, valor de retorno
y notas de comportamiento no obvio (por ejemplo, que `calcularRachaActual`
devuelve 0 si "hoy" no está marcado, aunque haya racha histórica) —
información que evita releer las 500 líneas del archivo cada vez. El
README es el punto de partida (contexto, cómo levantar el proyecto), pero
no sustituye a este documento para trabajar en el código día a día.

**Qué mejoraría en una segunda iteración**:
- Capturas de pantalla reales en `GUIA_USUARIO.md` (hoy es solo texto).
- Enlazar cada función de `REFERENCIA_FUNCIONES.md` a su línea exacta en
  el repositorio.
- Validar automáticamente que la documentación sigue coincidiendo con el
  comportamiento real tras cada cambio — ya existe un hook que actualiza
  `REFERENCIA_FUNCIONES.md` al editar `app.js` (ver `CLAUDE.md`), pero
  `GUIA_USUARIO.md` puede quedar desactualizada sin que nada lo detecte si
  cambia la interfaz visible.
