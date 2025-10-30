import { resolve } from "path";
import { readdir } from "fs/promises";
import { loadTestsFromFile } from "./loadTestsFromFile";

type LoadTestsFromDirArgs = {
  dir: string;
};

export const loadTestsFromDir = async ({ dir }: LoadTestsFromDirArgs) => {
  const entries = await readdir(dir, { withFileTypes: true });

  for await (const entry of entries) {
    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      await loadTestsFromDir({ dir: fullPath });
    } else if (entry.isFile() && /\.(test|spec)\.(ts|tsx)$/.test(entry.name)) {
      await loadTestsFromFile({ filePath: fullPath });
    }
  }
};
