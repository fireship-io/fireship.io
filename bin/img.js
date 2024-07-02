// Convert images to webp format

import { readdirSync, rmSync } from 'fs';
import { exec } from 'child_process';

// npx @squoosh/cli --webp auto ./4.jpg 
const dir = './content/courses/linux/img/prizes/';
// const dir = './static/img/testimonial/';
const files = readdirSync(dir)
files.forEach(file => {
    if (!file.includes('.webp')) {
        exec(`npx @squoosh/cli@latest --webp auto ${dir}${file} -d ${dir}`, (err, stdout) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(stdout);
            console.log(file);
            rmSync(`${dir}${file}`);
        });
    }
});
