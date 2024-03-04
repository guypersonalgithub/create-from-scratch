import { testDependency } from "@packages/test-dependency";

export const testing = () => {
  console.log("test");
  return 1235 + testDependency();
};
