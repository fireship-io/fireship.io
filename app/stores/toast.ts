import { writable } from 'svelte/store';

interface Toast {
    message: string;
    type?: 'success' | 'error' | 'info';
    icon?: string;
    delay?: number;
}

export const toast = writable<Toast>(null);

window.addEventListener('flamethrower:router:fetch', (e) => {
    toast.set(null)
});
