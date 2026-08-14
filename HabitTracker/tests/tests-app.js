// tests-app.js — Suite de tests para js/app.js.
// Se ejecuta en el navegador contra las funciones reales de app.js (cargado
// antes que este script en tests.html), sin frameworks ni npm.

// --- FECHAS / UTILIDADES ---

test('formatearFechaISO_formatea_fecha_normal', () => {
  assertIgual(formatearFechaISO(new Date(2026, 7, 14)), '2026-08-14');
});

test('formatearFechaISO_rellena_mes_y_dia_de_un_digito_con_cero', () => {
  assertIgual(formatearFechaISO(new Date(2026, 0, 5)), '2026-01-05');
});

test('formatearFechaISO_anio_bisiesto_29_febrero', () => {
  assertIgual(formatearFechaISO(new Date(2024, 1, 29)), '2024-02-29');
});

test('obtenerFechaHoy_devuelve_formato_YYYY_MM_DD', () => {
  assertVerdadero(/^\d{4}-\d{2}-\d{2}$/.test(obtenerFechaHoy()), 'no cumple el formato esperado');
  assertIgual(obtenerFechaHoy(), formatearFechaISO(new Date()));
});

test('obtenerUltimosNDias_devuelve_la_longitud_pedida', () => {
  assertIgual(obtenerUltimosNDias(5).length, 5);
});

test('obtenerUltimosNDias_cero_dias_devuelve_array_vacio', () => {
  assertIgual(obtenerUltimosNDias(0).length, 0);
});

test('obtenerUltimosNDias_ultimo_elemento_es_hoy', () => {
  const dias = obtenerUltimosNDias(5);
  assertIgual(formatearFechaISO(dias[dias.length - 1]), obtenerFechaHoy());
});

test('obtenerUltimosNDias_orden_ascendente_dia_a_dia', () => {
  const dias = obtenerUltimosNDias(4).map(formatearFechaISO);
  for (let i = 1; i < dias.length; i++) {
    const anterior = new Date(dias[i - 1] + 'T00:00:00');
    anterior.setDate(anterior.getDate() + 1);
    assertIgual(dias[i], formatearFechaISO(anterior), `día ${i} no es consecutivo al anterior`);
  }
});

test('obtenerUltimos7Dias_devuelve_7_fechas_ISO_terminando_hoy', () => {
  const dias = obtenerUltimos7Dias();
  assertIgual(dias.length, 7);
  dias.forEach((f) => assertVerdadero(/^\d{4}-\d{2}-\d{2}$/.test(f), `"${f}" no es una fecha ISO`));
  assertIgual(dias[dias.length - 1], obtenerFechaHoy());
});

// --- MODELO ---

test('crearHabito_crea_objeto_con_los_campos_esperados', () => {
  const habito = crearHabito('Leer', 'Mente');
  assertIgual(habito.nombre, 'Leer');
  assertIgual(habito.categoria, 'Mente');
  assertIgual(habito.fechasCompletadas, []);
  assertVerdadero(typeof habito.id === 'string' && habito.id.length > 0, 'id vacío o no es string');
  assertVerdadero(!Number.isNaN(Date.parse(habito.creadoEn)), 'creadoEn no es una fecha válida');
});

test('crearHabito_fechasCompletadas_no_se_comparte_entre_instancias', () => {
  const h1 = crearHabito('A', 'Mente');
  const h2 = crearHabito('B', 'Cuerpo');
  h1.fechasCompletadas.push('2026-01-01');
  assertIgual(h2.fechasCompletadas, []);
});

// --- LÓGICA: RACHAS ---

test('calcularRachaActual_sin_fechas_completadas_devuelve_0', () => {
  const habito = crearHabito('Leer', 'Mente');
  assertIgual(calcularRachaActual(habito), 0);
});

test('calcularRachaActual_completado_solo_hoy_devuelve_1', () => {
  const habito = crearHabito('Leer', 'Mente');
  habito.fechasCompletadas = [obtenerFechaHoy()];
  assertIgual(calcularRachaActual(habito), 1);
});

test('calcularRachaActual_cuenta_dias_consecutivos_hasta_hoy', () => {
  const habito = crearHabito('Leer', 'Mente');
  habito.fechasCompletadas = obtenerUltimosNDias(4).map(formatearFechaISO); // hoy + 3 anteriores
  assertIgual(calcularRachaActual(habito), 4);
});

test('calcularRachaActual_no_cuenta_dias_sueltos_antiguos_si_hoy_no_esta', () => {
  const hace5 = new Date();
  hace5.setDate(hace5.getDate() - 5);
  const hace4 = new Date();
  hace4.setDate(hace4.getDate() - 4);
  const habito = crearHabito('Leer', 'Mente');
  habito.fechasCompletadas = [formatearFechaISO(hace5), formatearFechaISO(hace4)];
  assertIgual(calcularRachaActual(habito), 0);
});

test('calcularRachaActual_es_la_racha_actual_no_la_historica', () => {
  // Decisión documentada del proyecto: si "hoy" no está completado, la racha
  // actual es 0 aunque ayer sí se completara (no se cuenta la racha histórica).
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const habito = crearHabito('Leer', 'Mente');
  habito.fechasCompletadas = [formatearFechaISO(ayer)];
  assertIgual(calcularRachaActual(habito), 0);
});

test('obtenerMejorRacha_lista_vacia_devuelve_racha_0', () => {
  assertIgual(obtenerMejorRacha([]), { racha: 0, nombre: '' });
});

test('obtenerMejorRacha_todos_en_cero_devuelve_racha_0', () => {
  const habitos = [crearHabito('A', 'Mente'), crearHabito('B', 'Cuerpo')];
  assertIgual(obtenerMejorRacha(habitos).racha, 0);
});

test('obtenerMejorRacha_elige_el_habito_con_mas_racha', () => {
  const bajo = crearHabito('Bajo', 'Mente');
  bajo.fechasCompletadas = [obtenerFechaHoy()];
  const alto = crearHabito('Alto', 'Cuerpo');
  alto.fechasCompletadas = obtenerUltimosNDias(3).map(formatearFechaISO);
  const mejor = obtenerMejorRacha([bajo, alto]);
  assertIgual(mejor.nombre, 'Alto');
  assertIgual(mejor.racha, 3);
});

// --- FILTRO POR CATEGORÍA ---

test('obtenerHabitosVisibles_todos_devuelve_la_lista_completa', () => {
  filtroCategoriaActual = 'todos';
  const habitos = [crearHabito('A', 'Mente'), crearHabito('B', 'Cuerpo')];
  assertIgual(obtenerHabitosVisibles(habitos).length, 2);
});

test('obtenerHabitosVisibles_filtra_por_categoria', () => {
  filtroCategoriaActual = 'Cuerpo';
  const habitos = [crearHabito('A', 'Mente'), crearHabito('B', 'Cuerpo')];
  const visibles = obtenerHabitosVisibles(habitos);
  assertIgual(visibles.length, 1);
  assertIgual(visibles[0].nombre, 'B');
  filtroCategoriaActual = 'todos'; // no contaminar otros tests
});

test('obtenerHabitosVisibles_categoria_sin_habitos_devuelve_vacio', () => {
  filtroCategoriaActual = 'Salud';
  const habitos = [crearHabito('A', 'Mente')];
  assertIgual(obtenerHabitosVisibles(habitos), []);
  filtroCategoriaActual = 'todos';
});

// --- ALMACENAMIENTO: casos normales ---

test('cargarHabitos_sin_datos_en_storage_devuelve_array_vacio', () => {
  conStorageLimpio(() => {
    assertIgual(cargarHabitos(), []);
  });
});

test('guardarHabitos_y_cargarHabitos_hacen_un_roundtrip_correcto', () => {
  conStorageLimpio(() => {
    const original = [crearHabito('Leer', 'Mente'), crearHabito('Correr', 'Cuerpo')];
    guardarHabitos(original);
    const recuperado = cargarHabitos();
    assertIgual(recuperado.length, 2);
    assertIgual(recuperado[0].nombre, 'Leer');
    assertIgual(recuperado[1].categoria, 'Cuerpo');
  });
});

// --- ALMACENAMIENTO: regresión de bugs encontrados por el subagente bugs-logica (commit ec6d543) ---

test('REGRESION_cargarHabitos_json_invalido_no_rompe_la_app', () => {
  conStorageLimpio(() => {
    localStorage.setItem(CLAVE_STORAGE, '{esto no es JSON válido');
    assertIgual(cargarHabitos(), []);
  });
});

test('REGRESION_cargarHabitos_formato_antiguo_array_plano_no_pierde_datos', () => {
  conStorageLimpio(() => {
    const formatoAntiguo = [
      { id: '1', nombre: 'Leer', categoria: 'Mente', creadoEn: '2026-01-01T00:00:00.000Z', fechasCompletadas: ['2026-01-01'] }
    ];
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(formatoAntiguo));
    const habitos = cargarHabitos();
    assertIgual(habitos.length, 1);
    assertIgual(habitos[0].nombre, 'Leer');
  });
});

test('REGRESION_cargarHabitos_migra_fechasCompletadas_ausente_a_array_vacio', () => {
  conStorageLimpio(() => {
    const datos = { habits: [{ id: '1', nombre: 'Dormir', categoria: 'Salud', creadoEn: '2026-01-01T00:00:00.000Z' }] };
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
    const habitos = cargarHabitos();
    assertVerdadero(Array.isArray(habitos[0].fechasCompletadas), 'fechasCompletadas no es un array');
    assertIgual(habitos[0].fechasCompletadas, []);
  });
});

test('cargarHabitos_migra_categoria_ausente_a_Mente', () => {
  conStorageLimpio(() => {
    const datos = { habits: [{ id: '1', nombre: 'Dormir', creadoEn: '2026-01-01T00:00:00.000Z', fechasCompletadas: [] }] };
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
    assertIgual(cargarHabitos()[0].categoria, 'Mente');
  });
});

// --- INTEGRACIÓN: lógica + almacenamiento ---

test('toggleFecha_marca_y_desmarca_una_fecha_en_storage', () => {
  conStorageLimpio(() => {
    const habito = crearHabito('Meditar', 'Mente');
    guardarHabitos([habito]);

    toggleFecha(habito.id, '2026-08-01');
    assertVerdadero(cargarHabitos()[0].fechasCompletadas.includes('2026-08-01'), 'no se marcó la fecha');

    toggleFecha(habito.id, '2026-08-01');
    assertVerdadero(!cargarHabitos()[0].fechasCompletadas.includes('2026-08-01'), 'no se desmarcó la fecha');
  });
});

test('eliminarHabito_quita_solo_ese_habito_de_storage', () => {
  conStorageLimpio(() => {
    const h1 = crearHabito('A', 'Mente');
    const h2 = crearHabito('B', 'Cuerpo');
    guardarHabitos([h1, h2]);

    eliminarHabito(h1.id);
    const restantes = cargarHabitos();
    assertIgual(restantes.length, 1);
    assertIgual(restantes[0].nombre, 'B');
  });
});

// --- FECHAS / UTILIDADES: huecos de cobertura ---

test('formatearFechaLarga_formatea_con_dia_semana_mes_y_opcionalmente_anio', () => {
  const fecha = new Date(2026, 7, 14); // 14 de agosto de 2026
  const esperadoSinAnio = `Hoy, ${DIAS_SEMANA[fecha.getDay()]}, 14 de agosto`;
  const esperadoConAnio = `${DIAS_SEMANA[fecha.getDay()]}, 14 de agosto · 2026`;
  assertIgual(formatearFechaLarga(fecha, false), esperadoSinAnio);
  assertIgual(formatearFechaLarga(fecha, true), esperadoConAnio);
});

// --- INTEGRACIÓN: huecos de cobertura ---

test('toggleCompletado_marca_y_desmarca_la_fecha_de_hoy_en_storage', () => {
  conStorageLimpio(() => {
    const habito = crearHabito('Meditar', 'Mente');
    guardarHabitos([habito]);

    toggleCompletado(habito.id);
    assertVerdadero(cargarHabitos()[0].fechasCompletadas.includes(obtenerFechaHoy()), 'no marcó la fecha de hoy');

    toggleCompletado(habito.id);
    assertVerdadero(!cargarHabitos()[0].fechasCompletadas.includes(obtenerFechaHoy()), 'no desmarcó la fecha de hoy');
  });
});

test('manejarClickBorrarDatos_borra_datos_solo_si_se_confirma', () => {
  conStorageLimpio(() => {
    guardarHabitos([crearHabito('Leer', 'Mente')]);
    const confirmOriginal = window.confirm;

    try {
      window.confirm = () => false;
      manejarClickBorrarDatos();
      assertIgual(cargarHabitos().length, 1, 'no debería borrar los datos si el usuario cancela');

      window.confirm = () => true;
      manejarClickBorrarDatos();
      assertIgual(cargarHabitos(), [], 'debería borrar los datos si el usuario confirma');
    } finally {
      window.confirm = confirmOriginal;
    }
  });
});

mostrarResultadosTests();
