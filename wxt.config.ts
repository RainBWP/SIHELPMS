import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  webExt: {
    binaries: {
      // Arch Linux default Vivaldi binary path.
      chrome: process.env.VIVALDI_BIN ?? '/usr/bin/vivaldi',
    },
  },
});
