import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readdir, rm, writeFile } from 'fs/promises';

// https://vitejs.dev/config/
export default defineConfig({ 
  root: 'app',
  build: {
    outDir: '../static/svelte',
    emptyOutDir: true,
    assetsDir: '',
    // sourcemap: 'inline', // enable for debugging
  },
  server: {
    port: 4200,
  },
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
  }),
    syncToHugo()
  ]
})

function syncToHugo() {

  return {
    closeBundle: async () => {
      const svelteBuild = './static/svelte';
      const assets = await readdir(svelteBuild);
      const js = assets.filter(name => name.match(/(index.)(?!.*?esm)(?!.*?css).*\w+/))[0];
      const css = assets.filter(name => name.includes('.css'))[0];
      await Promise.all([
        writeFile(`./data/svelte.json`, JSON.stringify({ js, css })),
        rm('./static/svelte/index.html')
      ]);
      console.log(`wrote ${js} to hugo data`);
    }
  }
}