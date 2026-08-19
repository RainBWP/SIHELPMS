<script lang="ts" setup>
import Boton from '@/components/assets/boton.vue';
import InputLabel from '@/components/assets/inputLabel.vue';
import botonPeque from '@/components/assets/boton-peque.vue';

const onObtenerInformacion = () => {
  console.log('Obtener informacion');
};

const onBuscarAlumnos = () => {
  console.log('Buscar alumnos');
};

const onDescargarTitulos = () => {
  console.log('Descargar titulos');
};
</script>

<template>  
	<div class="main">
		<div class="header">
			<div class="title-row">
				<h1 class="title">SIHELPMS</h1>
				<botonPeque
          label="X"
        />
      </div>
			<p class="author">
				por
				<a
					class="author-name"
					href="https://github.com/rainbwp"
					target="_blank"
					rel="noopener noreferrer"
				>
					@rainbwp
				</a>
			</p>
    </div>

		<div class="info-block">
      <Boton label="Obtener Informacion" :action="onObtenerInformacion" />
			<p class="help-text">
        En revision de Expedientes, obtiene los estados de los estudiantes. Lo exporta a un Excel
			</p>
    </div>

    <InputLabel />

		<div class="actions-block">
			<div class="action-row">
        <Boton label="Buscar Alumnos" :action="onBuscarAlumnos" />
        <Boton label="Descargar Titulos" :action="onDescargarTitulos" />
      </div>
			<p class="footer-text">
        En base a los datos de arriba, se obtendra lo siguiente de los botones
			</p>
    </div>
  </div>
</template>
<style scoped>
.main {
	width: 100%;
	height: 600px;
	border-radius: 20px;
	background-color: #fff;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 40px 20px;
	box-sizing: border-box;
	gap: 20px;
	text-align: left;
	font-size: 12px;
	color: #ddc9a3;
	font-family: 'Comic Neue';
}

.header {
	align-self: stretch;
	height: 23px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
	gap: -17px;
	font-size: 20px;
	color: #a7201f;
}

.title-row {
	align-self: stretch;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 20px;
	flex-shrink: 0;
}

.title {
	position: relative;
	margin: 0;
}

.close-text {
	position: relative;
	margin: 0;
}

.close-btn {
	border-radius: 100px;
	background-color: #bc955c;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	font-size: 10px;
	color: #fff;
}

.author {
	position: relative;
	font-size: 10px;
	flex-shrink: 0;
	margin: 0;
}

.author-name {
	text-decoration: underline;
	color: inherit;
}

.info-block {
	width: 173px;
	height: 62px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 1px;
}

.help-text {
	align-self: stretch;
	position: relative;
	font-size: 8px;
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
	justify-content: space-between;
	gap: 20px;
}

.footer-text {
	align-self: stretch;
	position: relative;
	font-size: 8px;
	font-weight: 300;
	color: #000;
	text-align: center;
	margin: 0;
}

</style>