// test-runner.js — mini framework de tests sin dependencias externas.
// No usa npm ni librerías de testing: se ejecuta directamente en el navegador.

const resultadosTests = { pasados: 0, fallados: 0, detalles: [] };

function test(nombre, fn) {
  try {
    fn();
    resultadosTests.pasados++;
    resultadosTests.detalles.push({ nombre, ok: true });
  } catch (error) {
    resultadosTests.fallados++;
    resultadosTests.detalles.push({ nombre, ok: false, error: error.message });
  }
}

function assertIgual(actual, esperado, mensaje) {
  const iguales = JSON.stringify(actual) === JSON.stringify(esperado);
  if (!iguales) {
    throw new Error(
      `${mensaje || 'Valores distintos'}: esperado ${JSON.stringify(esperado)}, obtenido ${JSON.stringify(actual)}`
    );
  }
}

function assertVerdadero(valor, mensaje) {
  if (!valor) throw new Error(mensaje || 'Se esperaba un valor verdadero');
}

// Aísla un test que lee/escribe habitTracker_data para que no deje residuos
// ni se vea afectado por datos previos en localStorage (mismo origen que la app real).
function conStorageLimpio(fn) {
  localStorage.removeItem(CLAVE_STORAGE);
  try {
    fn();
  } finally {
    localStorage.removeItem(CLAVE_STORAGE);
  }
}

function mostrarResultadosTests() {
  const contenedor = document.getElementById('test-output');

  const resumen = document.createElement('h2');
  resumen.textContent = `${resultadosTests.pasados} pasados, ${resultadosTests.fallados} fallados`;
  resumen.style.color = resultadosTests.fallados === 0 ? '#388E3C' : '#DC2626';
  contenedor.appendChild(resumen);

  resultadosTests.detalles.forEach((d) => {
    const linea = document.createElement('p');
    linea.textContent = d.ok ? `✅ ${d.nombre}` : `❌ ${d.nombre}: ${d.error}`;
    linea.style.color = d.ok ? '#388E3C' : '#DC2626';
    linea.style.fontFamily = 'monospace';
    linea.style.margin = '2px 0';
    contenedor.appendChild(linea);
  });

  console.log(`TESTS: ${resultadosTests.pasados} pasados, ${resultadosTests.fallados} fallados`);
  resultadosTests.detalles
    .filter((d) => !d.ok)
    .forEach((d) => console.error(`FALLO: ${d.nombre} — ${d.error}`));
}
