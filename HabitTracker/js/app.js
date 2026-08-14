// app.js — Lógica principal de HabitTracker

// --- CONSTANTES ---
const CLAVE_STORAGE = 'habitTracker_data';
const CATEGORIAS = ['Mente', 'Cuerpo', 'Salud'];
const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

let filtroCategoriaActual = 'todos';

// --- ALMACENAMIENTO ---
function cargarHabitos() {
  const datos = localStorage.getItem(CLAVE_STORAGE);
  if (!datos) return [];

  let parseado;
  try {
    parseado = JSON.parse(datos);
  } catch (error) {
    console.error('habitTracker_data contiene JSON inválido, se ignora:', error);
    return [];
  }

  // Tolerante al formato antiguo (array plano) y al actual ({ habits: [...] })
  const habitos = Array.isArray(parseado) ? parseado : (parseado.habits || []);

  habitos.forEach((h) => {
    // 'Mente' es la categoría por defecto para hábitos guardados antes de
    // que el campo categoria existiera en el modelo (iteración 2 del profesor).
    if (!h.categoria) h.categoria = 'Mente';
    if (!Array.isArray(h.fechasCompletadas)) h.fechasCompletadas = [];
  });

  return habitos;
}

function guardarHabitos(habitos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify({ habits: habitos }));
}

// --- MODELO ---
function crearHabito(nombre, categoria) {
  return {
    id: Date.now().toString(),
    nombre,
    categoria,
    creadoEn: new Date().toISOString(),
    fechasCompletadas: []
  };
}

// --- FECHAS / UTILIDADES ---
function formatearFechaISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function obtenerFechaHoy() {
  return formatearFechaISO(new Date());
}

function obtenerUltimosNDias(n) {
  const dias = [];
  for (let i = n - 1; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    dias.push(fecha);
  }
  return dias;
}

function obtenerUltimos7Dias() {
  return obtenerUltimosNDias(7).map(formatearFechaISO);
}

function formatearFechaLarga(fecha, conAnio) {
  const diaSemana = DIAS_SEMANA[fecha.getDay()];
  const dia = fecha.getDate();
  const mes = MESES[fecha.getMonth()];

  if (conAnio) {
    return `${diaSemana}, ${dia} de ${mes} · ${fecha.getFullYear()}`;
  }
  return `Hoy, ${diaSemana}, ${dia} de ${mes}`;
}

// --- LÓGICA ---
function toggleFecha(id, fecha) {
  const habitos = cargarHabitos();
  const habito = habitos.find((h) => h.id === id);
  if (!habito) return;

  const indice = habito.fechasCompletadas.indexOf(fecha);

  if (indice === -1) {
    habito.fechasCompletadas.push(fecha);
  } else {
    habito.fechasCompletadas.splice(indice, 1);
  }

  guardarHabitos(habitos);
  renderizarTodo();
}

function toggleCompletado(id) {
  toggleFecha(id, obtenerFechaHoy());
}

function eliminarHabito(id) {
  const habitos = cargarHabitos().filter((h) => h.id !== id);
  guardarHabitos(habitos);
  renderizarTodo();
}

function calcularRachaActual(habito) {
  let racha = 0;
  const fecha = new Date();

  while (true) {
    const fechaStr = formatearFechaISO(fecha);
    if (habito.fechasCompletadas.includes(fechaStr)) {
      racha++;
      fecha.setDate(fecha.getDate() - 1);
    } else {
      break;
    }
  }

  return racha;
}

function obtenerMejorRacha(habitos) {
  let mejor = { racha: 0, nombre: '' };

  habitos.forEach((habito) => {
    const racha = calcularRachaActual(habito);
    if (racha > mejor.racha) {
      mejor = { racha, nombre: habito.nombre };
    }
  });

  return mejor;
}

// --- UI / RENDER: HOY ---
function renderizarFechaHeader() {
  const hoy = new Date();
  document.getElementById('fecha-cabecera').textContent = formatearFechaLarga(hoy, true);
  document.getElementById('fecha-larga').textContent = formatearFechaLarga(hoy, false);
}

function renderizarPuntitosSemana(habito) {
  const contenedor = document.createElement('div');
  contenedor.className = 'puntitos-semana';

  obtenerUltimos7Dias().forEach((fecha) => {
    const completado = habito.fechasCompletadas.includes(fecha);
    const punto = document.createElement('button');
    punto.type = 'button';
    punto.className = 'punto' + (completado ? ' completado' : '');
    punto.dataset.id = habito.id;
    punto.dataset.fecha = fecha;
    punto.setAttribute('aria-label', `${completado ? 'Desmarcar' : 'Marcar'} ${habito.nombre} el ${fecha}`);
    contenedor.appendChild(punto);
  });

  return contenedor;
}

function obtenerHabitosVisibles(habitos) {
  return filtroCategoriaActual === 'todos'
    ? habitos
    : habitos.filter((h) => h.categoria === filtroCategoriaActual);
}

function renderizarTarjetaHabito(habito, hoy) {
  const completadoHoy = habito.fechasCompletadas.includes(hoy);

  const tarjeta = document.createElement('div');
  tarjeta.className = 'habit-card' + (completadoHoy ? ' completado' : '');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completadoHoy;
  checkbox.dataset.id = habito.id;
  checkbox.className = 'checkbox-completado';
  checkbox.setAttribute('aria-label', `Marcar ${habito.nombre} como completado hoy`);

  const nombre = document.createElement('span');
  nombre.className = 'habit-nombre';
  nombre.textContent = habito.nombre;

  const etiqueta = document.createElement('span');
  etiqueta.className = 'tag-categoria tag-' + habito.categoria.toLowerCase();
  etiqueta.textContent = habito.categoria;

  const puntitos = renderizarPuntitosSemana(habito);

  const btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btn-eliminar-habito';
  btnEliminar.dataset.id = habito.id;
  btnEliminar.textContent = '×';
  btnEliminar.setAttribute('aria-label', 'Eliminar hábito');

  tarjeta.append(checkbox, nombre, etiqueta, puntitos, btnEliminar);
  return tarjeta;
}

function renderizarHabitos() {
  const contenedor = document.getElementById('habit-cards');
  const habitos = cargarHabitos();
  const hoy = obtenerFechaHoy();

  const habitosFiltrados = obtenerHabitosVisibles(habitos);

  contenedor.innerHTML = '';

  if (habitos.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.className = 'mensaje-vacio-card';
    mensaje.textContent = 'Aún no hay hábitos. Añade el primero para empezar.';
    contenedor.appendChild(mensaje);
    return;
  }

  if (habitosFiltrados.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.className = 'mensaje-vacio-card';
    mensaje.textContent = 'No hay hábitos en esta categoría.';
    contenedor.appendChild(mensaje);
    return;
  }

  habitosFiltrados.forEach((habito) => {
    contenedor.appendChild(renderizarTarjetaHabito(habito, hoy));
  });
}

function renderizarResumen() {
  const habitosVisibles = obtenerHabitosVisibles(cargarHabitos());
  const hoy = obtenerFechaHoy();
  const completados = habitosVisibles.filter((h) => h.fechasCompletadas.includes(hoy)).length;
  const total = habitosVisibles.length;

  document.getElementById('contador-completados').textContent = `${completados}/${total}`;

  const porcentaje = total === 0 ? 0 : Math.round((completados / total) * 100);
  document.getElementById('barra-progreso-relleno').style.width = `${porcentaje}%`;
}

function renderizarMejorRacha() {
  const habitos = cargarHabitos();
  const mejor = obtenerMejorRacha(habitos);

  const etiquetaDias = mejor.racha === 1 ? 'día' : 'días';
  document.getElementById('racha-valor').textContent = `🔥 ${mejor.racha} ${etiquetaDias}`;
  document.getElementById('racha-habito').textContent = mejor.racha > 0 ? mejor.nombre : '—';
}

// --- UI / RENDER: HISTORIAL ---
function renderizarHistorial() {
  const contenedor = document.getElementById('historial-lista');
  const habitos = cargarHabitos();
  contenedor.innerHTML = '';

  if (habitos.length === 0) {
    contenedor.innerHTML = '<p class="mensaje-vacio">Todavía no hay hábitos ni historial que mostrar.</p>';
    return;
  }

  obtenerUltimosNDias(14).forEach((fecha) => {
    const fechaStr = formatearFechaISO(fecha);
    const completadosEseDia = habitos.filter((h) => h.fechasCompletadas.includes(fechaStr));

    const bloque = document.createElement('div');
    bloque.className = 'historial-dia';

    const titulo = document.createElement('h3');
    titulo.textContent = formatearFechaLarga(fecha, false).replace('Hoy, ', '');
    titulo.textContent = titulo.textContent.charAt(0).toUpperCase() + titulo.textContent.slice(1);

    const detalle = document.createElement('p');
    detalle.textContent = completadosEseDia.length === 0
      ? 'Ningún hábito completado.'
      : `Completados: ${completadosEseDia.map((h) => h.nombre).join(', ')}`;

    bloque.append(titulo, detalle);
    contenedor.appendChild(bloque);
  });
}

// --- UI / RENDER: VISTA SEMANAL ---
function renderizarCabeceraSemanal(cabecera, dias7) {
  cabecera.innerHTML = '';

  const thHabito = document.createElement('th');
  thHabito.textContent = 'Hábito';
  cabecera.appendChild(thHabito);

  dias7.forEach((fecha) => {
    const fechaObj = new Date(fecha + 'T00:00:00');

    const th = document.createElement('th');

    const nombreDia = document.createElement('span');
    nombreDia.className = 'dia-header-nombre';
    nombreDia.textContent = DIAS_CORTOS[fechaObj.getDay()];

    const numeroDia = document.createElement('span');
    numeroDia.className = 'dia-header-numero';
    numeroDia.textContent = fechaObj.getDate();

    th.append(nombreDia, numeroDia);
    cabecera.appendChild(th);
  });
}

function renderizarCuerpoSemanal(cuerpo, habitos, dias7) {
  cuerpo.innerHTML = '';

  if (habitos.length === 0) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    celda.colSpan = dias7.length + 1;
    celda.className = 'mensaje-vacio';
    celda.textContent = 'Añade hábitos para ver su vista semanal aquí.';
    fila.appendChild(celda);
    cuerpo.appendChild(fila);
    return;
  }

  habitos.forEach((habito) => {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = habito.nombre;
    fila.appendChild(celdaNombre);

    dias7.forEach((fecha) => {
      const celda = document.createElement('td');
      const marca = document.createElement('span');
      marca.className = 'marca-dia' + (habito.fechasCompletadas.includes(fecha) ? ' completado' : '');
      celda.appendChild(marca);
      fila.appendChild(celda);
    });

    cuerpo.appendChild(fila);
  });
}

function renderizarVistaSemanal() {
  const cabecera = document.getElementById('vista-semanal-cabecera');
  const cuerpo = document.getElementById('vista-semanal-cuerpo');
  const habitos = cargarHabitos();
  const dias7 = obtenerUltimos7Dias();

  renderizarCabeceraSemanal(cabecera, dias7);
  renderizarCuerpoSemanal(cuerpo, habitos, dias7);
}

// --- UI / RENDER: GRÁFICOS ---
function renderizarGraficos() {
  const contenedor = document.getElementById('graficos-contenido');
  const habitos = cargarHabitos();
  contenedor.innerHTML = '';

  if (habitos.length === 0) {
    contenedor.innerHTML = '<p class="mensaje-vacio">Añade hábitos para ver sus estadísticas aquí.</p>';
    return;
  }

  const dias7 = obtenerUltimos7Dias();

  habitos.forEach((habito) => {
    const completadosUltimos7 = dias7.filter((fecha) => habito.fechasCompletadas.includes(fecha)).length;
    const porcentaje = Math.round((completadosUltimos7 / 7) * 100);

    const fila = document.createElement('div');
    fila.className = 'grafico-barra-fila';

    const nombre = document.createElement('span');
    nombre.textContent = habito.nombre;

    const pista = document.createElement('div');
    pista.className = 'grafico-barra-pista';
    const relleno = document.createElement('div');
    relleno.className = 'grafico-barra-relleno';
    relleno.style.width = `${porcentaje}%`;
    pista.appendChild(relleno);

    const porcentajeTexto = document.createElement('span');
    porcentajeTexto.className = 'grafico-barra-porcentaje';
    porcentajeTexto.textContent = `${porcentaje}%`;

    fila.append(nombre, pista, porcentajeTexto);
    contenedor.appendChild(fila);
  });
}

// --- RENDER GENERAL ---
function renderizarTodo() {
  renderizarHabitos();
  renderizarResumen();
  renderizarMejorRacha();
  renderizarHistorial();
  renderizarVistaSemanal();
  renderizarGraficos();
}

// --- TABS ---
function cambiarTab(nombreTab) {
  document.querySelectorAll('.tab-btn').forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.tab === nombreTab);
  });

  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('activo', panel.id === `tab-${nombreTab}`);
  });
}

// --- FILTROS ---
function aplicarFiltro(categoria) {
  filtroCategoriaActual = categoria;

  document.querySelectorAll('.filtro-btn').forEach((boton) => {
    boton.classList.toggle('activo', boton.dataset.categoria === categoria);
  });

  renderizarTodo();
}

// --- EVENTOS ---
function manejarSubmitFormulario(evento) {
  evento.preventDefault();

  const nombre = document.getElementById('input-nombre').value.trim();
  const categoria = document.getElementById('input-categoria').value;

  if (!nombre) return;

  const habitos = cargarHabitos();
  habitos.push(crearHabito(nombre, categoria));
  guardarHabitos(habitos);

  document.getElementById('form-add-habit').reset();
  renderizarTodo();
}

function manejarClickEnLista(evento) {
  if (evento.target.classList.contains('btn-eliminar-habito')) {
    const id = evento.target.dataset.id;
    const habito = cargarHabitos().find((h) => h.id === id);
    const nombre = habito ? habito.nombre : 'este hábito';
    const confirmado = window.confirm(`¿Seguro que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    eliminarHabito(id);
  }

  if (evento.target.classList.contains('punto')) {
    const { id, fecha } = evento.target.dataset;
    toggleFecha(id, fecha);
  }
}

function manejarCambioEnLista(evento) {
  if (evento.target.classList.contains('checkbox-completado')) {
    toggleCompletado(evento.target.dataset.id);
  }
}

function manejarClickBorrarDatos() {
  const confirmado = window.confirm('¿Seguro que quieres borrar todos los hábitos y su historial? Esta acción no se puede deshacer.');
  if (!confirmado) return;

  localStorage.removeItem(CLAVE_STORAGE);
  renderizarTodo();
}

function inicializarEventos() {
  document.querySelectorAll('.tab-btn').forEach((boton) => {
    boton.addEventListener('click', () => cambiarTab(boton.dataset.tab));
  });

  document.querySelectorAll('.filtro-btn').forEach((boton) => {
    boton.addEventListener('click', () => aplicarFiltro(boton.dataset.categoria));
  });

  document.getElementById('btn-nuevo-habito').addEventListener('click', () => {
    document.getElementById('input-nombre').focus();
  });

  document.getElementById('form-add-habit').addEventListener('submit', manejarSubmitFormulario);
  document.getElementById('habit-cards').addEventListener('click', manejarClickEnLista);
  document.getElementById('habit-cards').addEventListener('change', manejarCambioEnLista);
  document.getElementById('btn-borrar-datos').addEventListener('click', manejarClickBorrarDatos);
}

// --- INIT ---
function inicializar() {
  renderizarFechaHeader();
  inicializarEventos();
  renderizarTodo();
}

document.addEventListener('DOMContentLoaded', inicializar);
