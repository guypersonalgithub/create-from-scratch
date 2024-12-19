import { readFileSync } from "fs";

type GetRootPackageLockArgs = {
  projectAbsolutePath: string;
};

export const getRootPackageLock = ({ projectAbsolutePath }: GetRootPackageLockArgs) => {
  const rootPackageLock = readFileSync(`${projectAbsolutePath}/package-lock.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(rootPackageLock);
};
