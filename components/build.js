const fs = require('fs-extra');
const concat = require('concat');
const { join } = require('path');

(async function build() {
    try {
        const files = [
            './dist/components/runtime.js',
            './dist/components/polyfills.js',
            './dist/components/scripts.js',
            './dist/components/main.js'
          ];

          const chunkhash = Date.now();
          const dir = `../hugo/static/components`;
          await fs.ensureDir(dir);
          await fs.emptyDir(dir);

          const bundle = `wc.${chunkhash}.js`
          await concat(files, join(dir, bundle) );
          await fs.outputJSON(`../hugo/data/components.json`, { bundle })
    } catch(err) {
        console.log(err)
    }

})();