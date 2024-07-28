import { expect, test } from "vitest";
import { List } from "immutable";
import * as ElementTreeModule from "./divElementTree";

test("Init an empty element tree from a singleton", () => {
  const tabTitles = List([List(["Firefox"])]);
  expect(ElementTreeModule.initTabTree(tabTitles)).toStrictEqual(List([null]));
});

test("Init an empty element tree from one set of tabs", () => {
  const tabTitles = List([List([
    "Firefox", "Google Chrome", "Microsoft Edge", "Safari", "Brave", "Opera"
  ])]);
  expect(ElementTreeModule.initTabTree(tabTitles)).toStrictEqual(List([
    null, null, null, null, null, null
  ]));
});

test('Init an empty element tree with some keys', () => {
  const tabTitles = List([
    List(["Neovim", "VSCode", "Helix", "Emacs"]),
    List(["C", "C#", "Typescript", "Python", "Go", "Rust"])
  ]);
  const secondBranchMap = List([null, null, null, null, null, null]);
  const expectedMap = List([
    secondBranchMap,
    secondBranchMap,
    secondBranchMap,
    secondBranchMap
  ]);
  expect(ElementTreeModule.initTabTree(tabTitles)).toStrictEqual(expectedMap);
});

test('Set an element for a given set of indices and get it', () => {
  const tabTree = ElementTreeModule.initTabTree(List([
    List(["Neovim", "VSCode", "Helix", "Emacs"]),
    List(["C", "C#", "Typescript", "Python", "Go", "Rust"])
  ]));
  const indices = List([1, 2]);
  const newElement = { open: true } as unknown as HTMLDivElement;
  const expectedTabTree: ElementTreeModule.TabHTMLElementTree = List([
    List([null, null, null, null, null, null]),
    List([null, null, newElement, null, null, null]),
    List([null, null, null, null, null, null]),
    List([null, null, null, null, null, null]),
  ]);
  const newTabTree = ElementTreeModule.setTab(indices, newElement, tabTree);
expect(newTabTree).toStrictEqual(expectedTabTree);
});

test('Tab titles to distinct tab list and correct convertor', () => {
  const tabCommas = [
    "Neovim:C",
    "Neovim:Python",
    "VSCode:Typescript",
    "Neovim:Typescript",
    "VSCode:Python",
    "Emacs:Java"
  ];
  const expectedTitleSets = List([
    List(["Neovim", "VSCode", "Emacs"]),
    List(["C", "Python", "Typescript", "Java"])
  ]);
  const [titleSets, convertor] = ElementTreeModule.titleCommasToTitleSets(
    tabCommas
  );
  expect(titleSets).toStrictEqual(expectedTitleSets);
  const predicate = (tabTitles: List<string>) => {
    const gotTitles = convertor(tabTitles).map((tabIdx, tabSetIdx) => titleSets.get(tabSetIdx)?.get(tabIdx));
    expect(gotTitles).toStrictEqual(tabTitles);
  };
  predicate(List(["Neovim", "C"]));
  predicate(List(["Emacs", "C"]));
  predicate(List(["Emacs", "Python"]));
});
