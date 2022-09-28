import { writable } from 'svelte/store';
export const routeLoading = writable(false);

let timeout: NodeJS.Timeout;

window.addEventListener('flamethrower:router:fetch', (e) => {
    // delay for loads > 250ms
    timeout = setTimeout(() => {
        routeLoading.set(true)
    } , 0)
});
window.addEventListener('flamethrower:router:end', (e) => {
    // show for at least 400ms
    clearTimeout(timeout);
    setTimeout(() => {
        routeLoading.set(false)
    } , 400)
});

