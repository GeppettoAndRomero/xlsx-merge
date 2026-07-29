import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first 名前空間: ツールを runlocally.app/xlsx-merge/ 配下に「物理配置」する
  // （src/pages/xlsx-merge/ + public/xlsx-merge/）。base は使わない（base は URL に
  // prefix を付けるが dist を入れ子化せず、ルート配信の Pages と不整合になるため）。
  // バンドルアセットも /xlsx-merge/_assets/ に隔離し hub/他ツールと無衝突にする。
  build: {
    inlineStylesheets: 'auto',
    assets: 'xlsx-merge/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replaceAll('\\', '/');
            if (normalizedId.includes('/node_modules/exceljs/')) {
              return 'exceljs-engine';
            }
            if (normalizedId.includes('/node_modules/preact/')) {
              return 'vendor';
            }
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
