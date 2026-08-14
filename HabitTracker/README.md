# 🎯 HabitTracker

Aplicación web de una sola página para el seguimiento de hábitos diarios.
Permite añadir y eliminar hábitos personalizados, marcarlos como completados
cada día y ver el progreso mediante puntitos semanales, rachas y estadísticas.

## Características

- Alta y baja de hábitos con nombre y categoría (Mente, Cuerpo, Salud)
- Marcado de hábitos completados cada día
- Puntitos de los últimos 7 días por hábito
- Cálculo de racha actual y mejor racha
- Resumen diario de completados con barra de progreso
- Filtro de hábitos por categoría
- Vista semanal en tabla: los últimos 7 días como columnas y los hábitos
  como filas, con un círculo verde si se completó ese día
- Historial de los últimos 14 días
- Gráficos de cumplimiento semanal por hábito (barras en CSS puro)
- Opción para borrar todos los datos guardados

La app se organiza en 4 pestañas: **Hoy**, **Historial**, **Gráficos** y
**Configuración**. Es una herramienta personal, sin autenticación ni servidor.

## Tecnologías

- HTML5 semántico
- CSS3 (variables de color, Flexbox, Grid)
- JavaScript vanilla (ES6+), sin frameworks ni librerías externas
- `localStorage` para persistencia de datos en el navegador

## Requisitos

- Un navegador moderno con JavaScript habilitado (Chrome, Edge, Firefox...).
- Nada más: no requiere Node.js, `npm`, ni instalar ninguna dependencia.
- Opcional, solo si tu navegador restringe `file://` (ver más abajo): algo
  que sirva archivos estáticos por HTTP, por ejemplo Python 3 (ya incluye
  `python -m http.server`).

## Instalación

No hay instalación como tal: no es un paquete que se compile ni dependencias
que resolver. Basta con obtener los archivos del proyecto:

```bash
git clone https://github.com/nietomoreno84-lgtm/proyecto_tema6.git
cd proyecto_tema6/HabitTracker
```

Y ya está lista para usarse (ver "Cómo usarla" a continuación).

## Cómo usarla

Al no depender de un servidor, basta con abrir `index.html` directamente en
el navegador:

```
HabitTracker/index.html
```

> Nota: si tu navegador restringe la ejecución de JavaScript sobre archivos
> abiertos con `file://`, sirve la carpeta con un servidor estático simple,
> por ejemplo `python -m http.server` desde dentro de `HabitTracker/`, y
> abre `http://localhost:8000/index.html`.

Todos los datos (hábitos e historial de completados) se guardan en el
`localStorage` del navegador, por lo que persisten entre sesiones pero son
locales a ese navegador y ese equipo.

### Uso paso a paso

1. Escribe el nombre del hábito en el campo "Nuevo hábito...", elige su
   categoría (Mente, Cuerpo o Salud) y pulsa "Añadir".
2. Márcalo como completado hoy con el checkbox de su tarjeta, o haciendo
   clic en cualquiera de sus 7 puntitos semanales para marcar/desmarcar ese
   día en concreto (no hace falta que sea hoy).
3. Usa el filtro lateral ("Todos", "Mente", "Cuerpo", "Salud") para ver solo
   los hábitos de una categoría; el contador y la barra de progreso se
   ajustan también al filtro activo.
4. Consulta la pestaña **Historial** para ver la vista semanal en tabla y el
   detalle de los últimos 14 días.
5. Consulta la pestaña **Gráficos** para ver el porcentaje de cumplimiento
   de cada hábito en los últimos 7 días.
6. Elimina un hábito con el botón "×" de su tarjeta (pide confirmación), o
   borra todos los datos guardados desde la pestaña **Configuración**.

## Esquema de datos

Los hábitos se guardan en `localStorage` bajo la clave `habitTracker_data`,
como un objeto con la forma:

```json
{
  "habits": [
    {
      "id": "m3x1a2b-f8d21",
      "nombre": "Beber agua",
      "categoria": "Mente",
      "creadoEn": "2026-08-14T12:37:12.563Z",
      "fechasCompletadas": ["2026-08-14"]
    }
  ]
}
```

- `id`: identificador único, generado con `Date.now()` (en base 36) más un
  sufijo aleatorio, para que no colisione si se crean dos hábitos en el mismo
  milisegundo.
- `nombre`: texto introducido por el usuario.
- `categoria`: una de `Mente`, `Cuerpo` o `Salud`.
- `creadoEn`: fecha ISO de creación del hábito.
- `fechasCompletadas`: array de fechas (`YYYY-MM-DD`) en las que el hábito
  se marcó como completado.

## Tests

Suite de tests sin dependencias externas (ni npm, ni frameworks de testing)
para la lógica de `js/app.js`: casos normales, límite, de regresión sobre
bugs ya corregidos y de integración con `localStorage`.

Sírvela con un servidor local (los mismos motivos que para la app: algunos
navegadores restringen JavaScript sobre `file://`) y abre:

```
http://localhost:8000/tests/tests.html
```

Los resultados se muestran en la página (✅/❌ por test) y también se
imprimen en la consola del navegador (`TESTS: N pasados, M fallados`).

## Documentación

- [`CHANGELOG.md`](CHANGELOG.md) — registro de cambios, generado a partir
  del historial de Git.
- [`docs/GUIA_USUARIO.md`](docs/GUIA_USUARIO.md) — guía de uso para
  personas sin experiencia técnica, sin jerga.
- [`docs/REFERENCIA_FUNCIONES.md`](docs/REFERENCIA_FUNCIONES.md) —
  documentación técnica de cada función de `js/app.js` (parámetros, valor
  de retorno, ejemplos).
- [`docs/REFLEXION_DOCUMENTACION.md`](docs/REFLEXION_DOCUMENTACION.md) —
  comparativa de utilidad entre estos tres documentos.
- [`CLAUDE.md`](CLAUDE.md) — especificación original, convenciones de
  código y decisiones tomadas durante la construcción del proyecto.
- [`RESUMEN_PROYECTO.md`](RESUMEN_PROYECTO.md) — relato completo del
  proceso de construcción, de principio a fin.

## Estructura de carpetas

```
HabitTracker/
├── index.html              # Página principal (única)
├── css/
│   └── styles.css          # Todos los estilos
├── js/
│   └── app.js               # Toda la lógica de la aplicación
├── tests/
│   ├── tests.html               # Página que ejecuta la suite en el navegador
│   ├── test-runner.js           # Mini framework de aserciones, sin dependencias
│   └── tests-app.js             # Casos de test para js/app.js
├── docs/
│   ├── GUIA_USUARIO.md              # Guía para usuarios sin perfil técnico
│   ├── REFERENCIA_FUNCIONES.md      # Documentación función a función de app.js
│   └── REFLEXION_DOCUMENTACION.md   # Comparativa de los tres documentos
├── README.md
├── CHANGELOG.md             # Registro de cambios
├── CLAUDE.md                 # Especificación, convenciones y decisiones del proyecto
├── RESUMEN_PROYECTO.md      # Relato del proceso de construcción
└── LICENSE                  # Licencia MIT
```

## Restricciones de diseño

- Sin frameworks (React, Vue, Angular) ni librerías externas de gráficos
- Sin `npm` ni dependencias
- Sin servidor ni backend
- Sin autenticación ni base de datos externa
- Diseño pensado para escritorio (no responsive para móvil en esta versión)

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE): puedes usar,
copiar, modificar y redistribuir el código libremente, citando al autor
original y sin garantías de ningún tipo.
