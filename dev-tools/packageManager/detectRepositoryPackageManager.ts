import { join } from "path";
import { getProjectAbsolutePath } from "../paths";
import { existsSync } from "fs";
import { SupportedPackageManagers } from "./types";

export const detectRepositoryPackageManager = (): SupportedPackageManagers => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const packageLockPath = join(projectAbsolutePath, "package-lock.json");
  const packageLockExists = existsSync(packageLockPath);
  if (packageLockExists) {
    return "npm";
  }

  const yarnLockPath = join(projectAbsolutePath, "yarn.lock");
  const yarnLockExists = existsSync(yarnLockPath);
  if (yarnLockExists) {
    return "yarn";
  }

  const pnpmLockPath = join(projectAbsolutePath, "pnpm-lock.yaml");
  const pnpmLockExists = existsSync(pnpmLockPath);
  if (pnpmLockExists) {
    return "pnpm";
  }

  return "npm";
};
