import { existsSync, readFileSync } from "fs";
import { listChangedFiles } from "./listChangedFiles";
import { removeLastPathSegment } from "../paths";

export const detectChangedDependencies = async () => {
  const changedDependencies = new Set<string>();
  const changedFiles = await listChangedFiles();

  changedFiles?.forEach((changedFile) => {
    let currentFilePath = changedFile.file;
    while (currentFilePath.length > 0 && !existsSync(`${currentFilePath}/package.json`)) {
      currentFilePath = removeLastPathSegment({ path: currentFilePath });
    }

    const packageJsonPath = `${currentFilePath}/package.json`;
    const packageJsonExists = existsSync(packageJsonPath);
    if (!packageJsonExists) {
      return;
    }

    const packageJson = readFileSync(packageJsonPath, "utf-8");
    const { name } = JSON.parse(packageJson);
    changedDependencies.add(name);
  });

  return changedDependencies;
};
