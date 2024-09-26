import { dirname, join, parse } from "path";
import { existsSync } from "fs";

export const getProjectAbsolutePath = () => {
  const rootMarker = "node_modules";

  let dir = process.cwd();

  while (dir !== parse(dir).root) {
    if (existsSync(join(dir, rootMarker))) {
      return dir;
    }
    dir = dirname(dir);
  }

  throw new Error("Project root not found");
};
