import { pathToFileURL } from "url";

type LoadTestsFromFileArgs = {
  filePath: string;
};

export const loadTestsFromFile = async ({ filePath }: LoadTestsFromFileArgs) => {
  if (!filePath.endsWith("test.ts")) {
    return;
  }

  const fileUrl = pathToFileURL(filePath).href;
  await import(fileUrl);
};
