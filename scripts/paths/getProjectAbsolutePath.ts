import { fileURLToPath } from "url";
import path, { dirname } from "path";

export const getProjectAbsolutePath = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const separator = path.sep;
  const absPath = __dirname.replace(`${separator}scripts${separator}paths`, "");
  return absPath;
};
