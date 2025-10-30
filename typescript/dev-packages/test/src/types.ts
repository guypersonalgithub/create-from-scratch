import type { expect } from "./assert";

export type Test = {
  name: string;
  fn: (args: { expect: typeof expect }) => void | Promise<void>;
};