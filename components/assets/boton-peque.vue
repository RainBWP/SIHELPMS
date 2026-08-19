<script lang="ts" setup>
type ButtonAction = () => void;

const props = defineProps<{
	label: string;
	action?: ButtonAction;
}>();

const runAction = () => {
	props.action?.();
};
</script>

<template>
	<div
		:class="$style.boton"
		role="button"
		tabindex="0"
		@click="runAction"
		@keydown.enter="runAction"
		@keydown.space.prevent="runAction"
	>
		<div :class="$style.boton2">{{ props.label }}</div>
	</div>
</template>
<style module>
.boton {
  	position: relative;
	border-radius: 100px;
	background-color: #bc955c;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	box-sizing: border-box;
	text-align: left;
	font-size: 10px;
	color: #fff;
}

.boton2 {
  position: relative;
}

</style>