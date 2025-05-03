import { existsSync, readFileSync } from "fs";

type LoadGitIgnoreArgs = {
  gitIgnorePath: string;
};

export const loadGitIgnore = ({ gitIgnorePath }: LoadGitIgnoreArgs) => {
  if (!existsSync(gitIgnorePath)) {
    return [];
  }

  return readFileSync(gitIgnorePath, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
};
