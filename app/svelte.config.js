import sveltePreprocess from "svelte-preprocess";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/** @type {import('@sveltejs/kit').Config} */
export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    sveltePreprocess({
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      },
    }),
  ],
  compilerOptions: {
    customElement: true
  }
};
