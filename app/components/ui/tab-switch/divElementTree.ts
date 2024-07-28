import { List, OrderedMap } from "immutable";

/**
 * Tree whose the branches at the k-th depth are related to the tabs of the
 * k-th tab set. A leaf is the HTMLDivElement for a given combination of tabs
 * over all the tab sets. This element can not be existing.
 */
export type TabHTMLElementTree = List<TabHTMLElementTree> | List<HTMLDivElement | null>;

function isLastList(list: TabHTMLElementTree): list is List<HTMLDivElement | null> {
  if (list.isEmpty()) return true;
  return !List.isList(list.first());
}

/** Return a list of list of all distinct tab titles in an handy order
 * to next create a tab tree. A convertor between the the tab titles and their
 * index is also returned.
 * @param titleCommas strings with format
 * "title in set 1:title in set 2:title_in_set_3:_" 
 */
export function titleCommasToTitleSets(titleCommas: string[]): [
  List<List<string>>, (tabKeys: List<string>) => List<number>
] {
  if (titleCommas.length === 0) return [List(), () => List()];
  const titleSets: List<OrderedMap<string, number>> = List(titleCommas[0].split(":").map(() => OrderedMap()));
  const titleMaps = titleCommas.reduce(
    (titleSets, titleComma) => titleComma.split(":").
    reduce(
        (acc, titleForTabSet, tabSetIdx) => {
          const currentMap = acc.get(tabSetIdx)!;
          if (currentMap.get(titleForTabSet) !== undefined) return acc;
          return acc.set(tabSetIdx, currentMap.set(titleForTabSet, currentMap.size));
        },
        titleSets),
    titleSets);

  function tabKeysToTabIndices(tabKeys: List<string>): List<number> {
    if (tabKeys.size !== titleMaps.size)
      throw new Error("Invalid tab key list");
    return tabKeys.map((k, tabSetIdx) => {
      const tabIndex = titleMaps.get(tabSetIdx)!.get(k);
      if (tabIndex === undefined) return titleMaps.size; // One key does not exist in the tab switch, then return an invalid index
      return tabIndex;
    });
  }

  return [titleMaps.map((m) => List(m.keys())), tabKeysToTabIndices];
}

/**
  * @param tabTitles A list for each tab set of the tab titles
  * Return a deep "empty" ordered map with only null values;
  */
export function initTabTree(tabTitles: List<List<string>>): TabHTMLElementTree {
  function aux(accumulatedTabs: TabHTMLElementTree, remainingTitles: List<List<string>>): TabHTMLElementTree {
    if (remainingTitles.isEmpty()) return accumulatedTabs;
    const lastButtonSetTitles = remainingTitles.last()!;
    return aux(List(lastButtonSetTitles.map(() => accumulatedTabs)), remainingTitles.pop());
  }
  const lastTabSetTitles = tabTitles.last();
  if (!lastTabSetTitles) throw new Error("empty list");
  return aux(List(lastTabSetTitles.map(() => null)), tabTitles.pop());
}

/** Return a new TabTree with the given combination of tabs that is edited,
  * with the given value.
  *
  * @param tabIndices a combination of tab key over all the ordered tab sets
  * @param tabs The current tab tree with its depth equaling the length of `tabKeys`
  */
export function setTab(tabIndices: List<number>, tabValue: HTMLDivElement, tabs: TabHTMLElementTree) {
  type FlattenTabTree = List<List<TabHTMLElementTree>>;
  /** Returns a tuple with:
    * a flatten list of the edited branches of the `tabs` tree at each
    * depth excepted deepest one
    * the deepest edited branch
    *
    * @param tabKeys Never empty
    * @param tabs Never empty
    */
  function flattenTabTree(
    acc: FlattenTabTree,
    tabKeys: List<number>,
    tabs: TabHTMLElementTree
  ): [FlattenTabTree, List<HTMLDivElement|null>] {
    if (isLastList(tabs)) return [acc, tabs.set(tabKeys.first()!, tabValue)];
    // below the tabs tree is not empty and contains recursive trees
    const tabKey = tabKeys.first()!;
    const child = tabs.get(tabKey)!;
    return flattenTabTree(acc.push(tabs), tabKeys.shift(), child);
  }

  function setTabAux(toBeRecomposed: FlattenTabTree,
    recomposedChild: TabHTMLElementTree,
    toBeRecomposedTabIndices: List<number>
  ) {
    if (toBeRecomposed.isEmpty()) return recomposedChild;
    const parent = toBeRecomposed.last()!;
    const tabKey = toBeRecomposedTabIndices.last()!;
    return setTabAux(toBeRecomposed.pop(), parent.set(tabKey, recomposedChild),
      toBeRecomposedTabIndices.pop()
    );
  }

  const toBeReturned = setTabAux(...flattenTabTree(List(), tabIndices, tabs), tabIndices.pop());
  return toBeReturned;
}

/** Return null if a tab index is invalid (can happens if another tab switch
 * with more items exists)
 */
export function getTab(tabIndices: List<number>, tabTree: TabHTMLElementTree): HTMLDivElement | null {
  if (tabIndices.isEmpty()) throw new Error("Not enough long tab key list");
  const tabIndex = tabIndices.first()!;
  if (isLastList(tabTree)) {
    const element = tabTree.get(tabIndex);
    if (element === undefined) return null;
    return element;
  }
  const nextTabTree = tabTree.get(tabIndex);
  if (nextTabTree === undefined) return null;
  const nextTabIndices = tabIndices.shift();
  return getTab(nextTabIndices, nextTabTree);
}

type ArrayElementTree = Array<ArrayElementTree> | Array<HTMLDivElement | null>

function tabTreeToArray(tabTree: TabHTMLElementTree): ArrayElementTree {
  // TODO: make this tile-recursive
  if (isLastList(tabTree)) return tabTree.toArray();
  return tabTree.toArray().map(l => tabTreeToArray(l));
}

export function displayElementTree(tabTree: TabHTMLElementTree) {
  console.log(tabTreeToArray(tabTree));
}
