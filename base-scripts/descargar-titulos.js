// ESTE CODIGO VA EN LA TERMINAL DEL NAVEGADOR

// Pega tus CURPs aqui, separados por un salto de linea owo
const listaCurps = `
SAGJ070825MPLLRNA3
CURP2...
CURP3...
`.trim().split('\n').map(c => c.trim()).filter(c => c !== '');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function descargarPDF(curp, token) {
    const url = `https://siseems.sems.gob.mx/produccion/protected/pages/titulacion/digital/titulodigital2019.php?${token}`;
    try {
        console.log(`Descargando ${curp}... owo`);
        // Hacemos fetch al PDF
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Forzamos la descarga con el nombre que queremos
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${curp}.pdf`; 
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        console.log(`Descargado: ${curp}.pdf uwu`);
    } catch (error) {
        console.error(`Error con ${curp} TnT:`, error);
    }
}

async function procesarCurps() {
    // Agarramos todas las filas de la tabla
    const filas = document.querySelectorAll('tr[id^="tr"]');

    for (const curp of listaCurps) {
        let encontrado = false;

        for (const fila of filas) {
            const celdaCurp = fila.querySelector('td:nth-child(1)');
            
            // Si la primera celda tiene el CURP que buscamos
            if (celdaCurp && celdaCurp.innerText.includes(curp)) {
                const enlacePdf = fila.querySelector('a[onclick*="imprimir_certificado_digital611"]');

                if (enlacePdf) {
                    const onclickText = enlacePdf.getAttribute('onclick');
                    const match = onclickText.match(/imprimir_certificado_digital611\('([^']+)'\)/);

                    if (match && match[1]) {
                        const token = match[1];
                        await descargarPDF(curp, token);
                        encontrado = true;
                        
                        await delay(2000); // 2 segs de delay ewe
                        break;
                    }
                }
            }
        }

        if (!encontrado) {
            console.warn(`no encontre el CURP en la tabla: ${curp} :c`);
        }
    }
    console.log('Terminamos >:3');
}

procesarCurps();