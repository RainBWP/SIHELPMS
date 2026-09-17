// ============================================================================
// SCRIPT PARA CONSOLA: Validación de responsivas por CURP
// ============================================================================

// 1. LISTA DE CURPS A PROCESAR (pega aquí tus CURPs una por línea)
const listaCurps = `
AAAA070825MPLLRNA3
BBBB080611MVZRDMA0
CCCC070512MPLRRLA4
`.trim().split('\n').map(c => c.trim()).filter(c => c !== '');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Espera a que la tabla exista y tenga filas en el DOM (reintenta por hasta 15s)
async function esperarTablaCargada(maxSegundos = 15) {
    for (let i = 0; i < maxSegundos * 2; i++) {
        const filas = document.querySelectorAll('tr[id^="tr"]');
        if (filas.length > 0) {
            return filas;
        }
        await delay(500);
    }
    return null;
}

// Busca la fila por CURP en el DOM actual
function buscarFilaPorCurp(curp) {
    const filas = document.querySelectorAll('tr[id^="tr"]');
    for (const fila of filas) {
        const celdaCurp = fila.querySelector('td:nth-child(1)');
        if (celdaCurp && celdaCurp.innerText.trim().includes(curp)) {
            return fila;
        }
    }
    return null;
}

// Extrae el ID numérico de la fila
function extraerId(fila) {
    const matchTr = fila.id.match(/\d+/);
    if (matchTr) return matchTr[0];

    const input = fila.querySelector('input[id^="check_res_"]');
    if (input && input.value) return input.value;

    return null;
}

// Determina si la responsiva ya está marcada/validada
function estaValidada(fila, idNumber) {
    const checkbox = fila.querySelector(`#check_res_${idNumber}`) || fila.querySelector('input.class_resxx');
    if (!checkbox) return false;

    // Si ya está checked o si está disabled con checked
    return checkbox.checked || checkbox.hasAttribute('checked');
}

// Espera a que la tabla se regenere después del 2do clic
async function esperarRecargaDeTabla(curpObjetivo, maxSegundos = 15) {
    console.log("⏳ Esperando a que el sistema vuelva a generar la tabla (1-10s)...");
    
    // Pausa inicial para darle tiempo a la petición de comenzar y limpiar/actualizar el DOM
    await delay(1500);

    for (let i = 0; i < maxSegundos; i++) {
        const fila = buscarFilaPorCurp(curpObjetivo);
        if (fila) {
            const id = extraerId(fila);
            // Comprobamos si la fila ya se regeneró con la nueva información
            if (id) {
                console.log("✅ Tabla regenerada con éxito.");
                await delay(1000); // Margen de estabilidad
                return fila;
            }
        }
        await delay(1000);
    }
    return null;
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
async function procesarResponsivas() {
    console.log(`🚀 Iniciando proceso para ${listaCurps.length} CURPs...`);

    for (let index = 0; index < listaCurps.length; index++) {
        const curp = listaCurps[index];
        console.log(`\n--------------------------------------------------`);
        console.log(`[${index + 1}/${listaCurps.length}] Procesando CURP: ${curp}`);

        // 1. Asegurar que la tabla esté visible
        await esperarTablaCargada();

        // 2. Buscar la fila en el DOM actual
        const fila = buscarFilaPorCurp(curp);
        if (!fila) {
            console.warn(`⚠️ [SALTADO] No se encontró la CURP en la tabla: ${curp}`);
            continue;
        }

        const idNumber = extraerId(fila);
        if (!idNumber) {
            console.error(`❌ [ERROR] No se pudo obtener el ID de la fila para ${curp}`);
            continue;
        }

        // 3. CONTROL DE ERROR: Verificar si ya está validada
        if (estaValidada(fila, idNumber)) {
            console.warn(`⚠️ [OMITIDO] La responsiva para ${curp} (ID: ${idNumber}) YA está validada.`);
            continue;
        }

        console.log(`📌 ID detectado: ${idNumber}`);

        // 4. PRIMERA EJECUCIÓN
        console.log(`▶️ Ejecutando checar_responsiva(${idNumber}) [1/2]...`);
        if (typeof checar_responsiva === 'function') {
            checar_responsiva(Number(idNumber));
        } else {
            const cb = fila.querySelector(`#check_res_${idNumber}`);
            if (cb) cb.click();
        }

        // Breve espera antes del segundo llamado
        await delay(1500);

        // 5. SEGUNDA EJECUCIÓN (Provoca que se descargue y regenere la tabla)
        console.log(`▶️ Ejecutando checar_responsiva(${idNumber}) [2/2]...`);
        if (typeof checar_responsiva === 'function') {
            checar_responsiva(Number(idNumber));
        } else {
            const cb = fila.querySelector(`#check_res_${idNumber}`);
            if (cb) cb.click();
        }

        // 6. ESPERAR A QUE LA TABLA SE REGENERE (entre 1 a 10s)
        const filaActualizada = await esperarRecargaDeTabla(curp, 15);

        if (filaActualizada && estaValidada(filaActualizada, idNumber)) {
            console.log(`✨ Validada correctamente: ${curp}`);
        } else {
            console.log(`ℹ️ Tabla actualizada para ${curp}. Continuando...`);
        }

        // Pausa preventiva antes de pasar a la siguiente CURP
        await delay(2000);
    }

    console.log(`\n🎉 ¡Terminamos con toda la lista! >:3`);
}

// Ejecutar
procesarResponsivas();