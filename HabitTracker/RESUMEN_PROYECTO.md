# Resumen del proyecto — HabitTracker

Aplicación web de seguimiento de hábitos (HTML + CSS + JavaScript vanilla,
sin frameworks, sin servidor, con persistencia en `localStorage`).
Este documento recoge, en orden, todo el proceso seguido con Claude Code
hasta el cierre del proyecto.

## 1. Arranque del proyecto

- Se definió el alcance en `HabitTracker/CLAUDE.md`: descripción de la app,
  stack (HTML5 + CSS3 + JS vanilla + `localStorage`), estructura de carpetas,
  convenciones de código, paleta de colores, categorías de hábitos, las 4
  pestañas de la app (Hoy, Historial, Gráficos, Configuración) y las
  restricciones (sin frameworks, sin npm, sin backend, sin autenticación,
  diseño solo para escritorio).
- A partir de esa especificación se generaron los tres archivos base:
  - **HTML** — estructura semántica de las 4 pestañas.
  - **CSS** — estilos con variables de color en `:root`.
  - **JavaScript** — lógica principal: alta/baja de hábitos, marcado de
    completados, cálculo de rachas, puntitos de los últimos 7 días,
    gráficos de barras en CSS puro.
- Se generó el primer **README** a partir del código real ya escrito (no de
  una descripción genérica).

## 2. Primera ronda de correcciones

- **Pluralización de la racha**: se corrigió que mostrara "1 días" en vez de
  "1 día".
- **Esquema de `localStorage`**: se ajustó para seguir la especificación de
  una segunda iteración del profesor — clave `habitTracker_data`, datos
  envueltos en `{ "habits": [...] }` — y se añadió confirmación
  (`window.confirm`) antes de eliminar un hábito individual. Se decidió
  mantener los nombres de campo (`nombre`, `categoria`, `creadoEn`,
  `fechasCompletadas`) en español en vez de traducir al inglés, porque
  `categoria` ya era necesaria para el filtro por categorías.
- Se documentó ese esquema de datos en el README, con ejemplo JSON.

## 3. Comparación con el mockup del profesor

- Se hicieron **clicables los puntos semanales**: antes solo mostraban el
  estado, ahora se puede marcar/desmarcar cualquiera de los últimos 7 días
  (no solo el día de hoy).
- Se corrigieron los cálculos de racha y de la barra de progreso para que
  respetaran el filtro de categoría activo.
- **"Mejor racha"**: se implementó primero como racha histórica (siguiendo
  un documento del profesor), pero al revisar una captura previa de
  preguntas y respuestas se vio que la decisión real era "la racha actual".
  Se confirmó con el usuario y se revirtió a `calcularRachaActual` (la racha
  que llega hasta hoy, no la mejor racha histórica).

## 4. Vista semanal en el historial

- Se añadió una tabla nueva en la pestaña **Historial**: los últimos 7 días
  como columnas y los hábitos como filas, con un círculo verde si el hábito
  se completó ese día. Se actualiza sola reutilizando la misma función
  `renderizarTodo()` que usa el resto de la app.
- Quedó documentada en el README (funcionalidad + guía de uso paso a paso),
  pero ese cambio de documentación no se llegó a commitear en la misma
  sesión en que se implementó la vista.

## 5. Retomar la sesión y cerrar cabos sueltos

- Al continuar en una sesión nueva, antes de asumir que todo estaba
  commiteado se comprobó `git status`/`git diff` y aparecieron dos cambios
  pendientes de la sesión anterior:
  - Documentación de la vista semanal en el README (guía de uso paso a
    paso).
  - Refactor de CSS: nuevas variables `--color-danger`, `--color-danger-bg`
    y `--espaciado-xs`, y un contorno de foco visible y accesible en el
    campo de texto de nuevo hábito.
- Ambos cambios se probaron en el navegador sirviendo la carpeta con un
  servidor local (`python -m http.server`, ya que `file://` no funciona con
  las herramientas de automatización de navegador usadas), sin errores de
  consola, y se separaron en **dos commits distintos** por ser cambios de
  naturaleza diferente.
- Con confirmación explícita del usuario, se hizo `git push` para
  sincronizar `origin/main` (el repo llevaba varios commits sin subir).

## 6. Refinamiento del CLAUDE.md tras construir el proyecto

- Con el proyecto ya funcional, se releyeron `app.js`, `index.html` y
  `css/styles.css` completos junto con todo el historial de commits, para
  extraer las convenciones que **realmente** habían emergido durante la
  construcción (no las de un ejemplo genérico).
- Se propusieron las actualizaciones al usuario **antes** de aplicarlas, y
  tras su aprobación se añadieron al `CLAUDE.md` estas secciones nuevas:
  - **Convenciones JavaScript**: prefijos de función por rol (`cargar`/
    `guardar`, `crear`, `obtener`/`calcular`, `renderizar`, `manejar`),
    organización del archivo en bloques comentados, delegación de eventos,
    y la regla de no usar `innerHTML` con datos del usuario.
  - **Convenciones CSS**: modificadores de estado como `.activo` /
    `.completado` (sin prefijo `is-`), nomenclatura por componente, y la
    obligación de usar variables de `:root` para todo color/espaciado.
  - **Modelo de datos confirmado**: esquema exacto de `localStorage` y la
    regla de mantener la carga tolerante a datos antiguos.
  - **Restricciones aprendidas**: no hardcodear colores/espaciados (pasó dos
    veces con `--color-danger` antes de corregirse), confirmar acciones
    destructivas, accesibilidad (`aria-label`, foco visible), y comprobar
    `git status` al retomar una sesión.
  - **Flujo de trabajo probado**: plan → ejecutar con servidor local →
    revisar consola → commit por tipo de cambio → confirmar antes de push.
- Se commiteó y se subió a `origin/main` con permiso del usuario.

## 7. Revisión final del README

- Se comparó el README completo contra el código y el árbol de archivos
  real. Todo coincidía excepto un detalle: la sección "Estructura de
  carpetas" no incluía `CLAUDE.md`, que sí existe en la raíz del proyecto.
  Se añadió esa línea y se commiteó.

## 8. Reflexión de cierre y lecciones para el futuro

- Se revisó una reflexión sobre el proceso de trabajo con Claude Code
  (qué hizo el agente vs. qué decidió el usuario, dónde el agente rinde
  mejor y dónde necesita más dirección).
- Se concluyó que el proyecto en sí no necesitaba cambios adicionales (las
  buenas prácticas mencionadas ya estaban recogidas en el CLAUDE.md).
- Se guardaron dos lecciones nuevas, reutilizables en futuros proyectos:
  1. Especificar restricciones estéticas concretas (no solo colores:
     también bordes, sombras, tipografía) desde el primer CLAUDE.md.
  2. Trocear instrucciones grandes que toquen varios archivos o funciones
     en pasos más pequeños y focalizados.

## 9. Revisión de código con un subagente independiente

- Tras el cierre, se creó `.claude/agents/code-reviewer.md`: un subagente de
  solo lectura, sin el historial de la sesión de desarrollo, que audita el
  código contra las convenciones reales de `CLAUDE.md` en vez de contra
  buenas prácticas genéricas.
- Su primera revisión completa encontró un bug real: `obtenerFechaHoy()` (y
  las funciones que dependían de ella) calculaba "hoy" con
  `toISOString()` (UTC), mientras que la cabecera de la app usa hora local —
  desalineaba el checkbox de completado y las rachas cerca de medianoche en
  husos horarios positivos (España incluida). También detectó que el
  checkbox de "completado hoy" no tenía `aria-label`, a diferencia de los
  demás elementos solo-icono.
- Se corrigieron ambos con un helper único `formatearFechaISO(fecha)` basado
  en componentes de fecha locales, y se documentó la lección en `CLAUDE.md`.
  Probado en navegador vía servidor local, sin errores de consola.

## 10. Revisión con múltiples subagentes especializados en paralelo

- Se creó un segundo nivel de revisión: cuatro subagentes con un único foco
  cada uno (`bugs-logica`, `seguridad`, `convenciones`, `calidad`), lanzados
  a la vez sobre el mismo estado del código, cada uno sin ver el trabajo de
  los demás para dar una opinión independiente.
- **Seguridad**: sin hallazgos — todo el contenido de usuario se inserta con
  `textContent`/`createElement`, sin dependencias externas ni credenciales
  expuestas.
- **Bugs y lógica**: 3 hallazgos críticos en `cargarHabitos()` — `JSON.parse`
  sin manejo de errores (JSON corrupto rompía toda la app), migración
  incompleta (`fechasCompletadas` ausente causaba `TypeError`), y pérdida
  silenciosa de datos si `habitTracker_data` quedaba en el formato antiguo
  (array plano, previo al wrapper `{ habits: [...] }`).
- **Convenciones**: `crearPuntitosSemana` mal nombrada (debería ser
  `renderizarPuntitosSemana`), `actualizarFechaHeader` sin prefijo
  `renderizar`, `aplicarFiltro` sin pasar por `renderizarTodo()`, y
  `border-radius: 6px` hardcodeado 5 veces en CSS en vez de usar/crear
  variable.
- **Calidad**: 4 mejoras rankeadas (extraer `crearTarjetaHabito` de
  `renderizarHabitos`, generalizar el bucle de "últimos N días", documentar
  el porqué de la migración de `categoria`, dividir `renderizarVistaSemanal`).
- Se corrigieron los 3 hallazgos críticos de bugs/lógica: `cargarHabitos()`
  ahora envuelve `JSON.parse` en try/catch (devuelve `[]` si el dato está
  corrupto en vez de romper la app), completa la migración también para
  `fechasCompletadas` ausente/no-array, y detecta el formato antiguo en
  array plano con `Array.isArray(parseado)` para no perder esos datos. Los
  hallazgos de convenciones y calidad quedaron documentados, pendientes de
  una futura pasada.
- Probado en navegador con tres casos reales inyectados en `localStorage`
  (JSON inválido, hábito sin `fechasCompletadas`, formato antiguo en array
  plano): los tres se recuperan sin romper la app y sin errores de consola
  no capturados.

## Estado final

- **18 commits** en `main` (más los de esta ronda de revisión), historial
  limpio, mensajes en español.
- `origin/main` sincronizado con el repositorio local.
- Funcionalidad completa: alta/baja de hábitos, marcado diario, puntitos de
  7 días clicables, racha actual, resumen con barra de progreso, filtro por
  categoría, vista semanal en tabla, historial de 14 días, gráficos de
  cumplimiento y borrado de datos con confirmación.
- Documentación consistente con el código: `README.md` (features, uso,
  esquema de datos, estructura) y `CLAUDE.md` (especificación original +
  convenciones y lecciones reales del proceso de construcción, incluida la
  robustez de `cargarHabitos()` frente a datos rotos o antiguos).
- Cinco subagentes de revisión especializados disponibles en
  `.claude/agents/` (`code-reviewer` de propósito general, y los cuatro
  focalizados `bugs-logica`, `seguridad`, `convenciones`, `calidad`) para
  futuras rondas de auditoría del proyecto.
