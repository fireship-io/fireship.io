import { createCachedWritable } from "../util/helpers"

// Store the chosen tab title for each tab set
// TODO: limit the number of stored tab set with a history of the most recently
// used ones
export const { cachedWritable: chosenTabs } = createCachedWritable<Record<string, string>>(
  "chosen_tabs"
);
