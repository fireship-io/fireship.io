import { createCachedWritable } from "../util/helpers";

export type SettableBoolean = boolean | null;

const { cachedWritable: doesPreferDark } = createCachedWritable<boolean>("doesPreferDark");

export { doesPreferDark };
