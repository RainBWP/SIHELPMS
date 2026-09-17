<script lang="ts" setup>
import { computed, ref } from 'vue';
import { browser } from 'wxt/browser';
import Boton from '@/components/assets/boton.vue';
import InputLabel from '@/components/assets/inputLabel.vue';
import BotonPeque from '@/components/assets/boton-peque.vue';

const inputText = ref('');
const logs = ref<string[]>([]);
const operacionActiva = ref<'responsivas' | 'titulos' | null>(null);
const progreso = ref({ actual: 0, total: 0 });
let leyendoProgreso = false;

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const iniciarLecturaDeProgreso = async (tabId: number) => {
	leyendoProgreso = true;

	while (leyendoProgreso) {
		try {
			const [resultado] = await browser.scripting.executeScript({
				target: { tabId },
				func: () => (globalThis as typeof globalThis & {
					__sihelpmsProgreso?: { actual: number; total: number };
				}).__sihelpmsProgreso ?? null,
			});

			if (resultado?.result) progreso.value = resultado.result;
		} catch {
			// La pestaña puede cambiar o cerrarse mientras termina la operación.
		}

		await esperar(500);
	}
};

const detenerLecturaDeProgreso = () => {
	leyendoProgreso = false;
	progreso.value = { actual: 0, total: 0 };
};

const finalizarOperacion = () => {
	detenerLecturaDeProgreso();
	operacionActiva.value = null;
};

const etiquetaResponsivas = computed(() => operacionActiva.value === 'responsivas'
	? `Validar Responsivas (${progreso.value.actual} de ${progreso.value.total})`
	: 'Validar Responsivas');
const etiquetaTitulos = computed(() => operacionActiva.value === 'titulos'
	? `Descargar Titulos (${progreso.value.actual} de ${progreso.value.total})`
	: 'Descargar Titulos');

const clearLogs = () => {
	logs.value = [];
};

const addLog = (message: string) => {
	logs.value.push(message);
};

const onObtenerInformacion = () => {
	clearLogs();
  addLog('Obtener informacion');
  console.log('Obtener informacion');
};

const onBuscarAlumnos = () => {
	clearLogs();
  addLog('Buscar alumnos');
  console.log('Buscar alumnos');
};

const onChecarResponsiva = async () => {
	if (operacionActiva.value) return;
	operacionActiva.value = 'responsivas';
	clearLogs();

	const listaCurps = inputText.value
		.split('\n')
		.map((curp) => curp.trim())
		.filter((curp) => curp.length > 0);

	if (listaCurps.length === 0) {
		addLog('No hay CURPs para procesar');
		finalizarOperacion();
		return;
	}

	const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
	const urlActiva = tab?.url ? new URL(tab.url) : null;

	if (urlActiva?.hostname !== 'siseems.sems.gob.mx') {
		addLog('No se puede checar responsivas en esta pagina');
		finalizarOperacion();
		return;
	}

	const tabId = tab?.id;
	if (!tabId) {
		addLog('No se encontro una pestana activa valida');
		finalizarOperacion();
		return;
	}

	try {
		progreso.value = { actual: 0, total: listaCurps.length };
		void iniciarLecturaDeProgreso(tabId);
		const [resultado] = await browser.scripting.executeScript({
			target: { tabId },
			args: [listaCurps],
			func: async (curps: string[]) => {
				const mensajes: string[] = [];
				const actualizarProgreso = (actual: number) => {
					(globalThis as typeof globalThis & {
						__sihelpmsProgreso?: { actual: number; total: number };
					}).__sihelpmsProgreso = { actual, total: curps.length };
				};
				actualizarProgreso(0);
				const registrar = (mensaje: string) => {
					mensajes.push(mensaje);
					console.log(mensaje);
				};
				const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
				const obtenerFilas = () => Array.from(document.querySelectorAll('tr[id^="tr"]'));
				const buscarFila = (curp: string) => obtenerFilas().find((fila) => {
					const celdaCurp = fila.querySelector('td:nth-child(1)');
					return celdaCurp?.textContent?.includes(curp) ?? false;
				});
				const extraerId = (fila: Element) => {
					const idDeFila = fila.id.match(/\d+/)?.[0];
					if (idDeFila) return idDeFila;

					return fila.querySelector<HTMLInputElement>('input[id^="check_res_"]')?.value ?? null;
				};
				const estaValidada = (fila: Element, id: string) => {
					const checkbox = fila.querySelector<HTMLInputElement>(`#check_res_${id}, input.class_resxx`);
					return checkbox?.checked || checkbox?.hasAttribute('checked') || false;
				};
				const esperarTabla = async (curp: string, maxSegundos = 30) => {
					for (let intento = 0; intento < maxSegundos * 2; intento++) {
						const fila = buscarFila(curp);
						if (fila) return fila;
						await delay(500);
					}
					return null;
				};
				const esperarTablaCargada = async (maxSegundos = 30) => {
					for (let intento = 0; intento < maxSegundos * 2; intento++) {
						if (obtenerFilas().length > 0) return true;
						await delay(500);
					}
					return false;
				};
				const esperarValidacion = async (curp: string, id: string, maxSegundos = 30) => {
					for (let intento = 0; intento < maxSegundos * 2; intento++) {
						const fila = buscarFila(curp);
						if (fila && estaValidada(fila, id)) return fila;
						await delay(500);
					}
					return null;
				};

				await esperarTablaCargada();
				const validadas = curps.filter((curp) => {
					const fila = buscarFila(curp);
					const id = fila ? extraerId(fila) : null;
					return Boolean(fila && id && estaValidada(fila, id));
				});
				registrar(validadas.length > 0
					? `Ya validadas: ${validadas.join(', ')}`
					: 'Ya validadas: ninguna');

				for (const [indice, curp] of curps.entries()) {
					actualizarProgreso(indice + 1);
					let fila = await esperarTabla(curp);
					const id = fila ? extraerId(fila) : null;

					if (!fila || !id) {
						registrar(`No se puede validar ${curp}`);
						continue;
					}

					if (estaValidada(fila, id)) {
						registrar(`Ya validada: ${curp}`);
						continue;
					}

					registrar(`[${indice + 1}/${curps.length}] Validando: ${curp}`);
					const checarResponsiva = (globalThis as typeof globalThis & {
						checar_responsiva?: (idResponsiva: number) => void;
					}).checar_responsiva;

					if (!checarResponsiva) {
						registrar(`No se puede validar ${curp}`);
						continue;
					}

					checarResponsiva(Number(id));
					await delay(1500);
					checarResponsiva(Number(id));
					fila = await esperarValidacion(curp, id, 30);

					if (fila && estaValidada(fila, id)) {
						registrar(`Validada: ${curp}`);
					} else {
						registrar(`No se puede validar ${curp}`);
					}
				}

				actualizarProgreso(curps.length);
				return mensajes;
			},
		});

		logs.value.push(...(resultado?.result ?? []));
		finalizarOperacion();
	} catch (error) {
		addLog(`No se puede validar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
		finalizarOperacion();
	}
};

const onDescargarTitulos = async () => {
	if (operacionActiva.value) return;
	operacionActiva.value = 'titulos';
	clearLogs();
	addLog('Iniciando descarga de titulos...');

	const listaCurps = inputText.value
		.split('\n')
		.map((curp) => curp.trim())
		.filter((curp) => curp.length > 0);

	if (listaCurps.length === 0) {
		addLog('No hay CURPs para procesar');
		console.warn('No hay CURPs para procesar');
		finalizarOperacion();
		return;
	}

	const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

	if (!tab?.id) {
		addLog('No se encontro una pestana activa valida');
		console.error('No se encontro una pestana activa valida');
		finalizarOperacion();
		return;
	}

	const urlActiva = tab.url ? new URL(tab.url) : null;
	const esPaginaSiseems = urlActiva?.hostname === 'siseems.sems.gob.mx';
	const esPaginaIncorporadas = urlActiva?.hostname === '172.31.84.14';

	if (!esPaginaSiseems && !esPaginaIncorporadas) {
		addLog('La pestana activa no pertenece a una pagina compatible');
		finalizarOperacion();
		return;
	}

	try {
		progreso.value = { actual: 0, total: listaCurps.length };
		void iniciarLecturaDeProgreso(tab.id);
		const [resultado] = await browser.scripting.executeScript({
			target: { tabId: tab.id },
			args: [listaCurps, esPaginaIncorporadas],
			func: async (curps: string[], esPaginaIncorporadas: boolean) => {
				const mensajes: string[] = [];
				const actualizarProgreso = (actual: number) => {
					(globalThis as typeof globalThis & {
						__sihelpmsProgreso?: { actual: number; total: number };
					}).__sihelpmsProgreso = { actual, total: curps.length };
				};
				actualizarProgreso(0);
				const registrar = (mensaje: string) => {
					mensajes.push(mensaje);
					console.log(mensaje);
				};

				if (esPaginaIncorporadas) {
					const filas = document.querySelectorAll('#tabla_alumnos tbody tr');
					const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
					let descargados = 0;

					for (const [indice, curp] of curps.entries()) {
						actualizarProgreso(indice + 1);
						const fila = Array.from(filas).find((elemento) => elemento.innerHTML.includes(curp));
						const enlacePdf = fila?.querySelector<HTMLAnchorElement>(
							'a[href*="/tituloreporte/"][target="_blank"]',
						);

						if (!enlacePdf?.href) {
							continue;
						}

						try {
							const response = await fetch(enlacePdf.href);
							if (!response.ok) throw new Error(`HTTP ${response.status}`);

							const blobUrl = window.URL.createObjectURL(await response.blob());
							const enlaceDescarga = document.createElement('a');
							enlaceDescarga.href = blobUrl;
							enlaceDescarga.download = `${curp}.pdf`;
							document.body.appendChild(enlaceDescarga);
							enlaceDescarga.click();
							enlaceDescarga.remove();
							window.URL.revokeObjectURL(blobUrl);
							descargados++;
							await delay(1000);
						} catch (error) {
							console.error(`Error al descargar ${curp}`, error);
						}
					}

					registrar(`Proceso terminado. Se descargaron ${descargados} titulos.`);
					actualizarProgreso(curps.length);
					return mensajes;
				}

				const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

			const descargarPDF = async (curp: string, token: string) => {
				const url = `https://siseems.sems.gob.mx/produccion/protected/pages/titulacion/digital/titulodigital2019.php?${token}`;

				try {
					registrar(`Descargando ${curp}...`);
					const response = await fetch(url);
					if (!response.ok) throw new Error('Network error');

					const blob = await response.blob();
					const blobUrl = window.URL.createObjectURL(blob);

					const a = document.createElement('a');
					a.href = blobUrl;
					a.download = `${curp}.pdf`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);

					window.URL.revokeObjectURL(blobUrl);
					registrar(`Descargado: ${curp}.pdf`);
				} catch (error) {
					const mensaje = `Error con ${curp}: ${error instanceof Error ? error.message : 'Error desconocido'}`;
					mensajes.push(mensaje);
					console.error(mensaje, error);
				}
			};

			const filas = document.querySelectorAll('tr[id^="tr"]');

			for (const [indice, curp] of curps.entries()) {
				actualizarProgreso(indice + 1);
				let encontrado = false;

				for (const fila of filas) {
					const celdaCurp = fila.querySelector('td:nth-child(1)');

					if (celdaCurp && celdaCurp.textContent?.includes(curp)) {
						const enlacePdf = fila.querySelector('a[onclick*="imprimir_certificado_digital611"]');

						if (!enlacePdf) continue;

						const onclickText = enlacePdf.getAttribute('onclick') ?? '';
						const match = onclickText.match(/imprimir_certificado_digital611\('([^']+)'\)/);

						if (match?.[1]) {
							await descargarPDF(curp, match[1]);
							encontrado = true;
							await delay(2000);
							break;
						}
					}
				}

				if (!encontrado) {
					const mensaje = `No encontre el CURP en la tabla: ${curp}`;
					mensajes.push(mensaje);
					console.warn(mensaje);
				}
			}

			registrar('Terminamos');
			actualizarProgreso(curps.length);
			return mensajes;
			},
		});

		logs.value.push(...(resultado?.result ?? []));
		finalizarOperacion();
	} catch (error) {
		const mensaje = `Error al ejecutar la descarga: ${error instanceof Error ? error.message : 'Error desconocido'}`;
		addLog(mensaje);
		console.error(mensaje, error);
		finalizarOperacion();
	}
};
</script>

<template>  
	<div class="main">
		<div class="header">
			<div class="title-row">
				<h1 class="title">SIHELPMS</h1>
				
      </div>
			<p class="author">
				por
				<a
					class="author-name"
					href="https://github.com/RainBWP/SIHELPMS"
					target="_blank"
					rel="noopener noreferrer"
				>
					@rainbwp
				</a>
			</p>
    </div>

		<div class="info-block">
       <Boton v-if="false" label="Obtener Informacion" :action="onObtenerInformacion" />
			<p class="help-text">
        	En creación, actualmente descarga automaticamente los titulos aqui ingresados
			</p>
    </div>

	<InputLabel v-model="inputText" />

		<div class="actions-block">
			<div class="action-row">
				<div v-if="false" class="action-item">
					<Boton label="Buscar Alumnos" :action="onBuscarAlumnos" />
				</div>
				<div>
					<Boton
						:label="etiquetaResponsivas"
						:action="onChecarResponsiva"
						:disabled="operacionActiva !== null"
					/>
				</div>
				<div class="action-item">
					<Boton
						:label="etiquetaTitulos"
						:action="onDescargarTitulos"
						:disabled="operacionActiva !== null"
					/>
				</div>

      </div>
			<div class="footer-text" aria-live="polite">
				<p v-for="(log, index) in logs" :key="`${index}-${log}`">{{ log }}</p>
				<p v-if="logs.length === 0">En base a los datos de arriba, se obtendra lo siguiente de los botones</p>
			</div>
    </div>
  </div>
</template>