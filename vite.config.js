import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readdir, rm, writeFile } from "fs/promises";

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  build: {
    outDir: "../static/svelte",
    emptyOutDir: true,
    assetsDir: ".",
    watch: {
      include: ["./app/**", "./styles/**", "./layouts/**", "./content/**.html"],
    },
    // sourcemap: 'inline', // enable for debugging
  },
  server: {
    port: 4200,
  },
  plugins: [
    svelte(),
    syncToHugo(),
  ],
});

function syncToHugo() {
  return {
    closeBundle: async () => {
      const svelteBuild = "./static/svelte";
      const assets = await readdir(svelteBuild);
      const js = assets.filter((name) =>
        name.match(/(index.)(?!.*?esm)(?!.*?css).*\w+/),
      )[0];
      const css = assets.filter((name) => name.includes(".css"))[0];
      const token = Math.floor(Math.random() * 69420);
      await Promise.all([
        writeFile(`./data/svelte.json`, JSON.stringify({ js, css, token })),
        async () => {
          try {
            rm("./static/svelte/index.html");
          } catch {
            console.log("osef le fichier n'existe pas");
          }
        },
      ]);
      console.log(`wrote ${js} to hugo data`);
    },
  };
}
