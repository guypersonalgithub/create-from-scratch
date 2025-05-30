import { Test } from "./types";

const tests: Test[] = [];

type TestArgs = Test;

export const test = ({ name, fn }: TestArgs) => {
  tests.push({ name, fn });
};

export const run = async () => {
  let passed = 0;

  for (const t of tests) {
    try {
      await t.fn();
      console.log(`✅ ${t.name}`);
      passed++;
    } catch (e) {
      console.error(`❌ ${t.name}`);
      console.error(e);
    }
  }

  console.log(`\n${passed}/${tests.length} tests passed.`);
};
