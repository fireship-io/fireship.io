<svelte:options customElement="tab-switch" />

<script lang="ts">
import { onMount } from "svelte";
import type { Action } from "svelte/action";
import { chosenTabs } from "../../../stores";
import { derived, get } from "svelte/store";
import { List, Map } from "immutable";
import type { TabHTMLElementTree } from "./divElementTree";
import * as ElementTreeModule from "./divElementTree";

export let tabSetKey: string;

const tabSetKeys = List(tabSetKey.split(":"));
if (tabSetKeys.isEmpty())
  throw new Error("tabSetKeys is not correctly initialised");

let tabTitlesToTabIndices: (tabTitles: List<string>) => List<number>;
let buttonTitles: List<List<string>>;
let tabTree: TabHTMLElementTree;

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
  [buttonTitles, tabTitlesToTabIndices] = ElementTreeModule.
    titleCommasToTitleSets(slotChildren.map(v => v.title));
  const initialItems = ElementTreeModule.initTabTree(buttonTitles);
  tabTree = slotChildren.reduce(
    (acc, child) => ElementTreeModule.setTab(
      tabTitlesToTabIndices(List(child.title.split(":"))), child.element, acc
    ), initialItems);
    // ElementTreeModule.displayElementTree(tabTree); // for debug
  onMount(() => { node.remove() });
}

function setChosenTabIndex(tabSetKey: string, tabTitle: string) {
  chosenTabs.update(v => {
    if (!v) throw new Error("The variable cannot be empty");
    v[tabSetKey] = tabTitle;
    return v;
  })
}

// Initially set the chosen tab to 0 if there is not any existing stored value.
onMount(() => {
  const initialChosenTabs = get(chosenTabs);
  const toStoreValues = tabSetKeys.reduce((acc, tabSetKey) => {
    if (!initialChosenTabs || initialChosenTabs[tabSetKey] === undefined)
      return acc.set(tabSetKey, "");
    return acc
  }, Map<string, string>());
  if (!toStoreValues.isEmpty()) chosenTabs.update((v) => ({
    ...v, ...toStoreValues.toObject()
  }));
});

const defaultEmptyDiv = document.createElement("div");

const selectedTabTitles = derived(chosenTabs, (ct) => tabSetKeys.map(k =>
  ct ? (ct[k]??""): ""
));

</script>

<div>

  <div use:processSlotContent>
    <slot></slot>
  </div>

  {#if tabTree}
  {#each buttonTitles as buttonTitleSet, tabSetIdx}
  <ul class="choices">
      {#each buttonTitleSet as buttonTitle}
        <button 
            class={($selectedTabTitles.get(tabSetIdx)===buttonTitle)?
              "inactive-button":"active-button"}
            disabled={($selectedTabTitles.get(tabSetIdx)===buttonTitle)}
            on:click={() => setChosenTabIndex(
              tabSetKeys.get(tabSetIdx)??"never",
              buttonTitle
            )}
          >{buttonTitle}</button>
      {/each}
  </ul>
  {/each}
  <div class="content-class">
      {@html (
        ElementTreeModule.getTab(
          tabTitlesToTabIndices($selectedTabTitles), tabTree
        )??defaultEmptyDiv
      ).outerHTML}
  </div>
  {/if}

</div>

<style>
.active-button {
  @apply p-4 text-gray2 rounded-t-lg bg-gray4 hover:text-gray1 hover:bg-gray3 dark:text-gray2 dark:hover:bg-gray7 dark:hover:text-gray3;
}

.inactive-button {
  @apply p-4 text-gray2 bg-gray3 border-b-2 border-gray1 dark:text-white dark:border-gray5;
}

.choices {
  @apply flex flex-wrap rtl:space-x-reverse m-0;
}

.content-class {
  @apply p-4 border-dashed border-gray1 rounded-lg mt-0;
}
</style>
