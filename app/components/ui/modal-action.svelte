<svelte:options tag="modal-action" />

<script lang="ts">
  import { modal } from '../../stores/modal';
  export let type: 'open' | 'close' = 'open';
  export let name = 'default';
  function modalAction() {
    if (type === 'open') {
      modal.set(name);
    }
    if (type === 'close') {
      modal.set(null);
    }
  }
</script>

<span on:click={modalAction}>
  <slot></slot>
</span>
