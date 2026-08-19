(() => {
  // Seleccionamos las filas que contengan celdas
  const filas = document.querySelectorAll('#tabla_alumnos tr:has(td)');
  const conteo = {};
  let total = 0;

  filas.forEach(fila => {
    const celdas = fila.querySelectorAll('td');
    // El estatus está en la posición 8 (índice 7)
    if (celdas.length >= 8) {
      total++;
      // Limpiamos saltos de línea y espacios dobles
      const estatus = celdas[7].innerText.replace(/\s+/g, ' ').trim();
      conteo[estatus] = (conteo[estatus] || 0) + 1;
    }
  });

  console.log(`Total de alumnos contados: ${total}`);
  console.log('Desglose por estatus:');
  console.table(conteo);
})();