import { showNavbar } from '../stores/settings';
import { modal } from '../stores/modal';

function handleSpecialKeys(e: KeyboardEvent) {
  // open side nav
  if (e.ctrlKey && e.key === 'b') {
    console.log('ctrlb');
    e.preventDefault();
    showNavbar.update((v) => !v);
  }
  // close modal on escape key
  if (e.key === 'Escape') {
    modal.set(null);
  }
  // open search on / key
  if (e.key === '/' || (e.ctrlKey && e.key === 'p')) {
    e.preventDefault();
    modal.set('search');
  }
}

window.addEventListener('keydown', handleSpecialKeys);
