import { parseTypescript } from "@packages/parse-typescript";
import { readFileSync } from "fs";

type CountTestsInFileArgs = {
  path: string;
};

export const countTestsInFile = ({ path }: CountTestsInFileArgs) => {
  const content = readFileSync(path, "utf-8");
  const tokens = parseTypescript({ input: content });
  const testsCount = tokens.reduce((sum, current) => {
    if (current.type === "invoked-function" && current.value === "expect") {
      return sum + 1;
    }

    return sum;
  }, 0);

  return testsCount;
};
