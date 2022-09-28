// Convert images to webp format

import { readdirSync, rmSync } from 'fs';
import { exec } from 'child_process';

// npx @squoosh/cli --webp auto ./4.jpg 
const dir = './content/courses/react-next-firebase/img/prizes/';
const files = readdirSync(dir)
files.forEach(file => {
    if (!file.includes('.webp')) {
        exec(`npx @squoosh/cli --webp auto ${dir}${file} -d ${dir}`, (err, stdout) => {
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
