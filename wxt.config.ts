import { defineConfig } from 'wxt';

export default defineConfig({
	manifest: {
		name: 'SIHELPMS',
        short_name: 'SIHELPMS',
        description:
            'Extensión para descargar títulos digitales desde SISEEMS usando listas de CURPs.',
        homepage_url: 'https://github.com/RainBWP/SIHELPMS',

		action: {
			default_title: 'SIHELPMS',
			default_icon: {
				16: 'icon/icon-16.png',
				32: 'icon/icon-32.png',
				64: 'icon/icon-64.png',
				128: 'icon/icon-128.png',
				256: 'icon/icon-256.png',
			},
		},
		host_permissions: [
			'https://siseems.sems.gob.mx/*',
			'http://172.31.84.14/*',
			'https://172.31.84.14/*',
		],
		permissions: ['sidePanel', 'scripting', 'tabs'],
	},
	modules: ['@wxt-dev/module-vue'],
});