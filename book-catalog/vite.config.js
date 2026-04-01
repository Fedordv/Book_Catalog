import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Весь JS → один бандл
        entryFileNames: 'bundle.[hash].js',
        chunkFileNames: 'bundle.[hash].js',
        // Иконки и CSS → папка assets/
        assetFileNames: (assetInfo) => {
          if (/\.(svg|png|jpg|ico)$/.test(assetInfo.name)) {
            return 'assets/icons/[name][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    assetsInlineLimit: 0, // SVG не инлайним — оставляем файлами
  },
});