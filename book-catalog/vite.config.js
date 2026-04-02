import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',

  base: './',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },

      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'main.js',

        assetFileNames: (assetInfo) => {
          if (/\.(svg|png|jpg|jpeg|ico)$/.test(assetInfo.name)) {
            return 'assets/icons/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },

    assetsInlineLimit: 0,
    cssCodeSplit: false,
  },
});