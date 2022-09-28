<svelte:options tag="app-signin" />

<script lang="ts">
</script>

<modal-dialog name="signin" esc="true">
  <h1>Login</h1>
  <p>With magic email link:</p>
  <email-signin />
  <p>Or with account:</p>
  <google-signin />
  <apple-signin />
  <p class="footer">
    By signing up, you agree to Fireship's Terms of Service & Privacy Policy.
  </p>
</modal-dialog>

<style>
  .footer {
    @apply text-sm text-gray4;
  }
</style>
