import { createCachedWritable } from "../util/helpers"

export const { cachedWritable: chosenTabs } = createCachedWritable<Record<string, number>>(
  "chosen_tabs"
);
