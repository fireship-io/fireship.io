<svelte:options tag="sign-out" />
<script>
    import { firebaseSignOut } from '../../util/firebase';
</script>

<span on:click={firebaseSignOut}>
    <slot></slot>
</span>