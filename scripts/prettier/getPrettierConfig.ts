import { readFileSync } from "fs";
import { getProjectAbsolutePath } from "../paths";

export const getPrettierConfig = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const path = `${projectAbsolutePath}/.prettierrc.json`;
  const prettierConfig = readFileSync(path, { encoding: "utf-8" });
  const parsedConfig = JSON.parse(prettierConfig);

  return parsedConfig;
};
