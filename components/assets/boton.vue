<script lang="ts" setup>
type ButtonAction = () => void;

const props = defineProps<{
	label: string;
	action?: ButtonAction;
  disabled?: boolean;
}>();

const runAction = () => {
  if (props.disabled) return;
	props.action?.();
};
</script>

<template>
	<div
		class="button"
		role="button"
    :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="props.disabled"
    :class="{ disabled: props.disabled }"
		@click="runAction"
		@keydown.enter="runAction"
		@keydown.space.prevent="runAction"
	>
		<div class="button-label">{{ props.label }}</div>
	</div>
</template>
<style scoped>
.button {
  position: relative;
  border-radius: 100px;
  background-color: #691c32;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: left;
  font-size: 16px;
  color: #ddc9a3;
  font-family: 'Comic Neue';
}

.button.disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.button-label {
  position: relative;
}

</style>