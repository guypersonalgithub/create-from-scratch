import { existsSync, readFileSync, writeFileSync } from "fs";

type updateGitIgnoreArgs = {
  path?: string;
  filesToIgnore: string[];
};

export const updateGitIgnore = ({ path = ".gitignore", filesToIgnore }: updateGitIgnoreArgs) => {
  const gitIgnoreExists = existsSync(path);
  if (!gitIgnoreExists) {
    writeFileSync(path, "");
  }

  const gitIgnoreData = readFileSync(path, "utf-8");
  const splitIgnored = gitIgnoreData.split(/\r\n|\r|\n/);
  const existingIgnores = splitIgnored.length === 1 && splitIgnored[0] === "" ? [] : splitIgnored;
  filesToIgnore.forEach((file) => {
    const fileAlreadyExists = existingIgnores.find((existingFile) => existingFile === file);
    if (!fileAlreadyExists) {
      existingIgnores.push(file);
    }
  });

  writeFileSync(path, existingIgnores.join("\n"));
};
