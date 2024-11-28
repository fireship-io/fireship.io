<svelte:options tag="if-access" />

<script lang="ts">
  import { canAccess } from '../../stores/user';
	import { getCourseTier, COURSE_TIERS } from '../../util/helpers.ts';

  let courseTier = getCourseTier();
	let isFree = courseTier === COURSE_TIERS.free;
</script>

{#if isFree || $canAccess}
	<div class="mt-12 bg-gray7 rounded-lg shadow-3xl p-8 max-w-sm mx-auto border-green-500 border border-solid text-center">
		<p class="m-0 font-display text-green-500 no-underline text-xl">You have full access to this course 🎉</p>
	</div>
{/if}
{#if !isFree && !$canAccess}
		<slot name="denied"></slot>
{/if}
