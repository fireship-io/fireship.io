import { showNavbar } from '../stores/settings';
import { modal } from '../stores/modal';

const special = 'himom';
let buffer = '';

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
  if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
    e.preventDefault();
    modal.set('search');
  }

  if (special.includes(e.key)) {
    buffer += e.key;
    if (buffer === special) {
      console.log('HI MOM!');
      modal.set('himom');
      buffer = '';
    }
    if (!special.includes(buffer)) {
      buffer = '';
    }
   } else {
    buffer = '';
  }
}

window.addEventListener('keydown', handleSpecialKeys);
