<svelte:options customElement="quiz-modal" />

<script lang="ts">
  import { getCourseIdFromURL } from "../../util/helpers";
  import { componentsSide } from '../../stores/supabase-vars';

  export let answer: string;
  export let options: string; // Format foo:bar:baz
  export let prize: number; // /courses/{courseId}/img/prizes/{n}.webp
  const optionsList = options.split(":");
  let selected: string | null;
  let isComplete = false;
  let tries = 1;
  let xpGained: number;
  let courseId = getCourseIdFromURL();

  let wrongMsg: string;
  let correctMsg: string;

  function randomChoice<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function select(opt: string) {
    if (isComplete) return;
    selected = opt;
    opt === answer ? onCorrect() : onWrong();
  }

  function onWrong() {
    // TODO: make this definable outside the component (e.g. in the ./data folder)
    const arr = [
      "lol, try Again",
      "Yeah, that ain't it",
      "Nah bro",
      "Not even close",
      "Nooooo!",
      "try harder",
      "you serious?",
      "c'mon man!",
      "I'm disappointed",
      "I blame myself",
      "no prize for you",
    ];
    wrongMsg = randomChoice(arr);
    tries++;
  }

  async function onCorrect() {
    const confetti = (await import("../../util/confetti")).default;
    // TODO: same thing here
    const arr = [
      "well done sir",
      "that's legit",
      "crushed it",
      "hella good job",
      "bussin no cap fr",
      "take this fancy prize",
      "the best I can do is this meme",
      "enjoy your winnings",
      "hang this prize on your wall",
      "you earned this!",
    ];
    correctMsg = randomChoice(arr);
    let bonus = tries <= 2 ? 50 / tries : 5;
    xpGained = 100 + bonus;
    componentsSide.markCourse({ route: window.location.pathname, bonus });
    confetti();
    isComplete = true;
  }

  function reset() {
    selected = null;
    isComplete = false;
    xpGained = 0;
  }
</script>

<modal-dialog esc="true" name="quiz">
  <div class="wrap">
    {#if !isComplete}
      <p class="red">
        {#if selected && selected !== answer}
          {wrongMsg}
        {/if}
      </p>

      <!-- put question in slot -->
      <div>
        <slot />
      </div>

      <div>
        {#each optionsList as opt}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            role="button" tabindex="0"
            class="option"
            class:correct={opt === selected && selected === answer}
            class:incorrect={opt === selected && selected !== answer}
            on:click={() => select(opt)}
          >
            {opt}
          </div>
        {/each}
      </div>
    {:else}
      <p class="green"><span class="gain">+{xpGained} XP</span> {correctMsg}</p>
    {/if}

    <img
      src={`/courses/${courseId}/img/prizes/${prize}.webp`}
      alt="programming meme"
      class:show={isComplete}
    />

    {#if isComplete}
      <footer>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span role = "button" tabindex="0" class="reset" on:click={reset}>reset quiz</span>
      </footer>
    {/if}
  </div>
</modal-dialog>

<style>
  .option {
    @apply p-3 bg-black bg-opacity-50 my-2 hover:bg-orange-500 hover:text-white cursor-pointer;
  }
  .correct {
    @apply bg-green-500 text-white;
  }
  .incorrect {
    @apply bg-red-500 text-white hover:bg-red-500;
  }
  .red {
    @apply text-red-500 font-display;
  }
  .green {
    @apply text-green-500 font-display text-xl;
  }
  .gain {
    @apply relative bottom-[3px] bg-green-500 rounded-md px-2 py-1 text-white text-sm animate-pulse;
  }

  img {
    @apply my-5 max-h-[70vh] mx-auto block opacity-0 w-0 h-0 scale-0 rotate-180 transition-all;
  }
  .reset {
    @apply cursor-pointer no-underline mr-3 border-blue-500 border border-solid text-blue-500 text-sm rounded py-1 px-2 leading-none;
  }
  .show {
    @apply opacity-100 w-auto max-w-full h-auto scale-100 rotate-0;
  }
</style>
