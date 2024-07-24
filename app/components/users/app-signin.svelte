<svelte:options customElement="app-signin" />

<script lang="ts">
</script>

<modal-dialog name="signin" esc="true">
  <h1>Connexion</h1>
  <p>Avec votre compte:</p>
  <github-signin />
  <p class="footer">
    En vous connectant, vous consentez aux termes et service du site.
  </p>
</modal-dialog>

<style>
  .footer {
    @apply text-sm text-gray4;
  }
</style>
