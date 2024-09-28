import { dirname, join, parse } from "path";
import { existsSync } from "fs";
// import { fileURLToPath } from "url";

export const getProjectAbsolutePath = () => {
  const rootMarker = "node_modules";

  let dir = process.cwd();

  // const __filename = fileURLToPath(import.meta.url);
  // console.log(__filename);

  // const __dirname = dirname(__filename);
  // console.log(__dirname);

  // console.log({ dir });

  while (dir !== parse(dir).root) {
    if (existsSync(join(dir, rootMarker))) {
      return dir;
    }
    dir = dirname(dir);
  }

  throw new Error("Project root not found");
};
