(async function() {
    // Pega tu lista de CURPs aquí dentro, cada una separada por un enter
    const textoLista = `
        LUPA050428MPLNRXA5
        AAAI021001HPLMYVA3
    `;

    const curpsBuscadas = textoLista
        .split(/\r?\n/)
        .map(c => c.trim())
        .filter(c => c.length > 0);

    console.log(`Iniciando análisis para ${curpsBuscadas.length} CURPs...`);

    const filas = document.querySelectorAll('#tabla_alumnos tbody tr');
    let encontrados = 0;
    let registrosConError = [];

    for (let curp of curpsBuscadas) {
        let filaEncontrada = null;

        for (let fila of filas) {
            if (fila.innerHTML.includes(curp)) {
                filaEncontrada = fila;
                break;
            }
        }

        if (!filaEncontrada) {
            console.warn(`[-] La CURP ${curp} no se encontró en la tabla.`);
            continue;
        }

        // Verificamos si existe el botón de descarga del título PDF
        const linkPdf = filaEncontrada.querySelector('a[href*="/tituloreporte/"][target="_blank"]');

        if (linkPdf && linkPdf.href) {
            // Si tiene botón, procedemos a descargar
            console.log(`[+] Descargando CURP: ${curp}`);
            try {
                const response = await fetch(linkPdf.href);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `${curp}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
                
                encontrados++;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.error(`[-] Error al descargar el archivo para ${curp}:`, e);
            }
        } else {
            // Si no tiene botón de descarga, extraemos los datos para la tabla de errores
            const celdas = filaEncontrada.querySelectorAll('td');
            if (celdas.length >= 6) {
                // Carrera (limpiando etiquetas HTML internas)
                let carreraTexto = celdas[0].innerText.replace(/\n/g, ' ').trim();
                
                // No. Control
                let noControl = celdas[1].innerText.trim();
                
                // Nombre completo y CURP (la celda 2 contiene el nombre y un <small> con la CURP)
                let textoNombreCompleto = celdas[2].childNodes[0] ? celdas[2].childNodes[0].nodeValue.trim() : "Desconocido";
                
                // Mensaje de error (extraído de la celda de acciones o expediente)
                let spanError = filaEncontrada.querySelector('.red-text');
                let mensajeError = spanError ? spanError.innerText.trim() : "Sin botón de descarga / Error desconocido";

                registrosConError.push({
                    CURP: curp,
                    "NOMBRE COMPLETO": textoNombreCompleto,
                    "No. CONTROL": noControl,
                    CARRERA: carreraTexto,
                    ERROR: mensajeError
                });
            }
        }
    }

    console.log(`Proceso de descargas finalizado. Se descargaron ${encontrados} títulos correctamente.`);

    if (registrosConError.length > 0) {
        console.log(`%c Se encontraron ${registrosConError.length} registros con errores o sin botón de descarga:`, "color: red; font-weight: bold; font-size: 14px;");
        console.table(registrosConError);
    } else {
        console.log("¡Excelente! No se encontraron registros con errores en la lista proporcionada.");
    }
})();