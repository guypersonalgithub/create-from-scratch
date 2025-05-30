import { pathToFileURL } from "url";
import { resolve } from "path";
import { readdir } from "fs/promises";

type LoadTestsFromDirArgs = {
  dir: string;
};

export const loadTestsFromDir = async ({ dir }: LoadTestsFromDirArgs) => {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      await loadTestsFromDir({ dir: fullPath });
    } else if (entry.isFile() && /\.(test|spec)\.(ts|js)$/.test(entry.name)) {
      const fileUrl = pathToFileURL(fullPath).href;
      await import(fileUrl);
    }
  }
};
