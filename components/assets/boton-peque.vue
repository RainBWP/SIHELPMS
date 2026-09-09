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
		class="small-button"
		role="button"
		tabindex="0"
		@click="runAction"
		@keydown.enter="runAction"
		@keydown.space.prevent="runAction"
	>
		<div class="small-button-label">{{ props.label }}</div>
	</div>
</template>
<style scoped>
.small-button {
  	position: relative;
	border-radius: 100px;
	background-color: #bc955c;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 5px 10px;
	box-sizing: border-box;
	text-align: left;
	font-size: 12px;
	color: #fff;
	cursor: pointer;
}

.small-button-label {
  position: relative;
}

</style>