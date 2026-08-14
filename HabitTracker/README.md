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

## Esquema de datos

Los hábitos se guardan en `localStorage` bajo la clave `habitTracker_data`,
como un objeto con la forma:

```json
{
  "habits": [
    {
      "id": "1786711032563",
      "nombre": "Beber agua",
      "categoria": "Mente",
      "creadoEn": "2026-08-14T12:37:12.563Z",
      "fechasCompletadas": ["2026-08-14"]
    }
  ]
}
```

- `id`: identificador único, generado con `Date.now()`.
- `nombre`: texto introducido por el usuario.
- `categoria`: una de `Mente`, `Cuerpo` o `Salud`.
- `creadoEn`: fecha ISO de creación del hábito.
- `fechasCompletadas`: array de fechas (`YYYY-MM-DD`) en las que el hábito
  se marcó como completado.

## Estructura de carpetas

```
HabitTracker/
├── index.html        # Página principal (única)
├── css/
│   └── styles.css    # Todos los estilos
├── js/
│   └── app.js         # Toda la lógica de la aplicación
└── README.md
```

## Restricciones de diseño

- Sin frameworks (React, Vue, Angular) ni librerías externas de gráficos
- Sin `npm` ni dependencias
- Sin servidor ni backend
- Sin autenticación ni base de datos externa
- Diseño pensado para escritorio (no responsive para móvil en esta versión)
