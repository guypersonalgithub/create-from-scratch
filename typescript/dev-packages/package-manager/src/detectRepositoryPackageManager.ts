import { join } from "path";
import { getProjectAbsolutePath } from "@packages/paths";
import { existsSync } from "fs";
import { type PackageManagerLock, type SupportedPackageManagers } from "./types";

export const detectRepositoryPackageManager = (): {
  manager: SupportedPackageManagers;
  lock: PackageManagerLock;
} => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const packageLockPath = join(projectAbsolutePath, "package-lock.json");
  const packageLockExists = existsSync(packageLockPath);
  if (packageLockExists) {
    return { manager: "npm", lock: "package-lock.json" };
  }

  const yarnLockPath = join(projectAbsolutePath, "yarn.lock");
  const yarnLockExists = existsSync(yarnLockPath);
  if (yarnLockExists) {
    return { manager: "yarn", lock: "yarn.lock" };
  }

  const pnpmLockPath = join(projectAbsolutePath, "pnpm-lock.yaml");
  const pnpmLockExists = existsSync(pnpmLockPath);
  if (pnpmLockExists) {
    return { manager: "pnpm", lock: "pnpm-lock.yaml" };
  }

  return { manager: "npm", lock: "package-lock.json" };
};
