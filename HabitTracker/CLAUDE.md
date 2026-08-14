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
