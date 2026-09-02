import { defineConfig } from 'wxt';

export default defineConfig({
	manifest: {
		action: {
			default_title: 'SIHELPMS',
		},
		host_permissions: ['https://siseems.sems.gob.mx/*'],
	},
	modules: ['@wxt-dev/module-vue'],
});