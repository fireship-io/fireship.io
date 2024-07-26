<svelte:options customElement="tab-switch" />

<script lang="ts">
import { TabItem, Tabs } from "flowbite-svelte";
import { onMount } from "svelte";
import type { Action } from "svelte/action";
import { chosenTabs } from "../../stores/tabs";
import { derived, get } from "svelte/store";

export let tabSetKey: string;

let items: { title: string, element: Element }[];

function isDivElement(elt: Element): elt is HTMLDivElement {
  return elt.tagName === "DIV";
}

const processSlotContent: Action<HTMLDivElement> = (node) => {
  const slot = node.children.item(0)! as HTMLSlotElement;
  const slotChildren = Array.from(slot.assignedNodes()).
  map(node => node as HTMLDivElement | Element).
  filter(
    (elt) => isDivElement(elt) && elt.className.split(" ").includes('tab-switch-item')
  ).
  map(elt => elt as HTMLDivElement).
  map(
    element => ({
      title: element.getAttribute("title") ?? "",
      element: element
    })
  );
  items = slotChildren;
  console.log(items);
  onMount(() => { node.remove() })
}

function setChosenTabIndex(chosenIndex: number) {
  chosenTabs.update(v => {
    if (!v) throw new Error("The variable cannot be empty");
    v[tabSetKey] = chosenIndex;
    return v;
  })
}

// Initially set the chosen tab to 0 if there is not any existing stored value.
onMount(() => {
  const initialChosenTab = get(chosenTabs);
  if (!initialChosenTab) {
    chosenTabs.set({[tabSetKey]: 0});
    return;
  }
  if (!initialChosenTab[tabSetKey]) {
    chosenTabs.set({...initialChosenTab, [tabSetKey]: 0});
    return;
  }
});

const tabIndex = derived(chosenTabs, (ct) => ct ? (ct[tabSetKey]??0): 0);

</script>

<div use:processSlotContent>
  <slot></slot>
</div>

{#if items}
<ul class="choices">
{#each items as item, idx}
    <button class={($tabIndex===idx)?"active-button":"inactive-button"} on:click={() => setChosenTabIndex(idx)}>{item.title}</button>
{/each}
</ul>
<div class="content-class">
    {@html items[$tabIndex].element.outerHTML}
</div>
{/if}

<style>
.active-button {
  @apply p-4 text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500;
}
.inactive-button {
  @apply p-4 text-gray-500 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300;
}

.choices {
  @apply flex flex-wrap space-x-2 rtl:space-x-reverse;
}

.content-class {
  @apply p-4 bg-gray-50 rounded-lg dark:bg-gray-800 mt-4;
}
</style>
