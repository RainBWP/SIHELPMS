

<script lang="ts" setup>
import BotonPeque from './boton-peque.vue';

const modelValue = defineModel<string>({ default: '' });

const onImportarExcel = () => {
  console.log('Importar Excel');
};
</script>

<template>
	<div class="input-panel">
		<textarea
			id="input-label"
			name="input-label"
			class="student-input"
			v-model="modelValue"
			placeholder="Introduzca aqui las curps de los alumnos"
		></textarea>
		<BotonPeque v-if="false" label="Importar Excel" :action="onImportarExcel" />
		
  </div>
</template>
<style scoped>
.input-panel {
	width: 100%;
	height: 254px;
	border-radius: 10px;
	background-color: #fff;
	border: 4px solid #6f7271;
	box-sizing: border-box;
	overflow: hidden;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 10px;
	gap: 16px;
	min-height: 70px;
	max-height: 300px;
	text-align: left;
	font-size: 12px;
	color: #575757;
	font-family: 'Comic Neue';
}

.student-input {
	width: 100%;
	height: 100%;
	position: relative;
	font-size: 14px;
	font-family: 'Comic Neue';
	color: #000;
	text-align: left;
	display: inline-block;
	background: none;
	border: none;
	resize: none;
}

.student-input::placeholder {
	color: #575757;
}

.import-button {
	border-radius: 100px;
	background-color: #bc955c;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	cursor: pointer;
	border: none;
	color: #fff;
}

.import-button-text {
	position: relative;
}

</style>