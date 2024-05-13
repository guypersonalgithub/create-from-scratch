import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const getProjectAbsolutePath = () => {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
  const absPath = __dirname.replace("\\scripts\\utils", "");
  return absPath;
};
