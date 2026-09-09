<script lang="ts" setup>
import { ref } from 'vue';
import { browser } from 'wxt/browser';
import Boton from '@/components/assets/boton.vue';
import InputLabel from '@/components/assets/inputLabel.vue';
import BotonPeque from '@/components/assets/boton-peque.vue';

const inputText = ref('');
const logs = ref<string[]>([]);

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

const onDescargarTitulos = async () => {
	clearLogs();
	addLog('Iniciando descarga de titulos...');

	const listaCurps = inputText.value
		.split('\n')
		.map((curp) => curp.trim())
		.filter((curp) => curp.length > 0);

	if (listaCurps.length === 0) {
		addLog('No hay CURPs para procesar');
		console.warn('No hay CURPs para procesar');
		return;
	}

	const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

	if (!tab?.id) {
		addLog('No se encontro una pestana activa valida');
		console.error('No se encontro una pestana activa valida');
		return;
	}

	try {
		const [resultado] = await browser.scripting.executeScript({
			target: { tabId: tab.id },
			args: [listaCurps],
			func: async (curps: string[]) => {
				const mensajes: string[] = [];
				const registrar = (mensaje: string) => {
					mensajes.push(mensaje);
					console.log(mensaje);
				};
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

			for (const curp of curps) {
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
			return mensajes;
			},
		});

		logs.value.push(...(resultado?.result ?? []));
	} catch (error) {
		const mensaje = `Error al ejecutar la descarga: ${error instanceof Error ? error.message : 'Error desconocido'}`;
		addLog(mensaje);
		console.error(mensaje, error);
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
				<div class="action-item">
        		<Boton label="Descargar Titulos" :action="onDescargarTitulos" />
				</div>
      </div>
			<div class="footer-text" aria-live="polite">
				<p v-for="(log, index) in logs" :key="`${index}-${log}`">{{ log }}</p>
				<p v-if="logs.length === 0">En base a los datos de arriba, se obtendra lo siguiente de los botones</p>
			</div>
    </div>
  </div>
</template>
<style scoped>
.main {
	width: 100%;
	height: 100%;
	border-radius: 20px;
	background-color: #fff;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	box-sizing: border-box;
	gap: 16px;
	text-align: left;
	font-size: 14px;
	color: #ddc9a3;
	font-family: 'Comic Neue';
}

.header {
	align-self: stretch;
	display: flex;
	flex-direction: column;
	gap: 2px;
	color: #a7201f;
	user-select: none;
}

.title-row {
	align-self: stretch;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	flex-shrink: 0;
}

.title {
	position: relative;
	margin: 0;
	font-size: 30px;
	line-height: 1;
}

.close-text {
	position: relative;
	margin: 0;
	user-select: none;
}

.close-btn {
	border-radius: 100px;
	background-color: #bc955c;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	color: #fff;
}

.author {
	position: relative;
	font-size: 14px;
	flex-shrink: 0;
	margin: 0;
}

.author-name {
	text-decoration: underline;
	color: #a7201f;
}

.info-block {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
	user-select: none;
}

.help-text {
	align-self: stretch;
	position: relative;
	font-size: 11px;
	font-weight: 300;
	color: #95959a;
	margin: 0;
}

.actions-block {
	align-self: stretch;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
}

.action-row {
	align-self: stretch;
	display: flex;
	align-items: flex-start;
	gap: 14px;
}

.action-item {
	flex: 1;
}

.footer-text {
	align-self: stretch;
	position: relative;
	font-size: 12px;
	font-weight: 300;
	color: #000;
	text-align: left;
	margin: 0;
}

</style>