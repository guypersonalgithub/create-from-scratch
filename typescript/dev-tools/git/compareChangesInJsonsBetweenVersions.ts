import { readFileSync } from "fs";
import { readFileAtRevision } from "./readFileAtRevision";

type GetCurrentAndPreviousFilePathsArgs = {
  filePath: string;
};

const getCurrentAndPreviousFilePaths = ({ filePath }: GetCurrentAndPreviousFilePathsArgs) => {
  if (!filePath.includes("->")) {
    return {
      previousFilePath: filePath,
      currentFilePath: filePath,
    };
  }

  const [previousFilePath, currentFilePath] = filePath.split("->");
  return {
    previousFilePath: previousFilePath.trim(),
    currentFilePath: currentFilePath.trim(),
  };
};

type CompareChangesInJsonsBetweenVersionsArgs = {
  filePath: string;
  objectProperties: string[];
};

export const compareChangesInJsonsBetweenVersions = async ({
  filePath,
  objectProperties,
}: CompareChangesInJsonsBetweenVersionsArgs) => {
  const { previousFilePath, currentFilePath } = getCurrentAndPreviousFilePaths({ filePath });

  const previousVersion = await readFileAtRevision({
    filePath: previousFilePath,
    revision: "HEAD~1",
  });
  const currentVersion = JSON.parse(readFileSync(currentFilePath, { encoding: "utf-8" }));

  for (let i = 0; i < objectProperties.length; i++) {
    const property = objectProperties[i];
    const previousProperty = previousVersion[property] ?? {};
    const currentProperty = currentVersion[property] ?? {};

    const previousAmount = Object.keys(previousProperty);
    const currentAmount = Object.keys(currentProperty);
    if (previousAmount !== currentAmount) {
      return true;
    }

    for (const prevPropety in previousProperty) {
      const prevValue = previousProperty[prevPropety];
      const currentValue = currentProperty[prevPropety];

      if (prevValue !== currentValue) {
        return true;
      }
    }
  }

  return false;
};
