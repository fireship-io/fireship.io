<svelte:options customElement="tab-switch" />

<script lang="ts">
import { TabItem, Tabs } from "flowbite-svelte";
import { onMount } from "svelte";
import type { Action } from "svelte/action";
import MyTabItem from './tab-item.svelte'

let items: { open: boolean, title: string, element: Element }[];

const processSlotContent: Action<HTMLDivElement> = (node) => {
  const slot = node.children.item(0)! as HTMLSlotElement;
  const slotChildren = Array.from(slot.assignedNodes()).
  map(node => node as Element).
  filter(
    (elt) => elt.tagName === 'TAB-SWITCH-ITEM'
  ).
  map(
    element => ({
      open: element.getAttribute("open") === "true",
      title: element.getAttribute("title") ?? "",
      element: element
    })
  );
  items = slotChildren;
  console.log(items);
  onMount(() => { node.remove() })
}

</script>

<div use:processSlotContent>
  <slot></slot>
</div>
{#if items}
<Tabs> <!-- TODO: changing the style -->
  {#each items as item}
    <TabItem activeClasses="" title={item.title} open={item.open}>
      {@html item.element.outerHTML}
    </TabItem>
  {/each}
</Tabs>
{/if}
