// TODO: Find more appropriate place for this file

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

  const lineSplitter = "\r\n";

  const gitIgnoreData = readFileSync(path, "utf-8");
  const splitIgnored = gitIgnoreData.split(lineSplitter);
  filesToIgnore.forEach((file) => {
    const fileAlreadyExists = splitIgnored.find((existingFile) => existingFile === file);
    if (!fileAlreadyExists) {
      splitIgnored.push(file);
    }
  });

  writeFileSync(path, splitIgnored.join(lineSplitter));
};
