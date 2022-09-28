import { writable } from 'svelte/store';

export const autoplay = writable(JSON.parse(localStorage?.autoplay ?? true));
autoplay.subscribe((v) => { 
    if (localStorage) localStorage.autoplay = v
});