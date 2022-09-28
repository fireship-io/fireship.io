<svelte:options tag="autoplay-toggle" />

<script lang="ts">
  import { autoplay } from '../../stores/autoplay';
  function toggle(e: any) {
	autoplay.set(e.target.checked)
  }
</script>


<label class="switch">
	<input type="checkbox" checked={$autoplay} on:change={toggle}>
	<span class="slider"></span>
</label>


<style lang="scss">
	.switch {
		@apply relative inline-block w-10 h-5;
		input {
			@apply opacity-0 w-0 h-0;
		}
	}
	.slider {
		@apply bg-gray5 rounded-full absolute cursor-pointer inset-0 transition-all;
	}
	.slider:before {
		@apply absolute h-4 w-4 left-0.5 bottom-0.5 transition-all z-10 bg-gray7 rounded-full;
		content: '';
	}

	input:checked + .slider {
  		@apply bg-green-500;
	}

	input:focus + .slider {
		@apply shadow-md;
	}
	input:checked + .slider:before {
		@apply translate-x-5;
	}
</style>