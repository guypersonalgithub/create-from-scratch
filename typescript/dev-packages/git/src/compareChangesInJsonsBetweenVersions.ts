import { readFileSync } from "fs";
import { readFileAtRevision } from "./readFileAtRevision";
import { mergePaths } from "@packages/paths";

type GetCurrentAndPreviousFilePathsArgs = {
  projectAbsolutePath: string;
  filePath: string;
};

const getCurrentAndPreviousFilePaths = ({
  projectAbsolutePath,
  filePath,
}: GetCurrentAndPreviousFilePathsArgs) => {
  if (!filePath.includes("->")) {
    const formattedPath = mergePaths({
      path1: projectAbsolutePath,
      path2: filePath,
      path2Separator: "/",
    });

    return {
      previousFilePath: formattedPath,
      currentFilePath: formattedPath,
    };
  }

  const [previousFilePath, currentFilePath] = filePath.split("->");
  const formattedPreviousFilePath = mergePaths({
    path1: projectAbsolutePath,
    path2: previousFilePath.trim(),
    path2Separator: "/",
  });
  const formattedCurrentFilePath = mergePaths({
    path1: projectAbsolutePath,
    path2: currentFilePath.trim(),
    path2Separator: "/",
  });
  return {
    previousFilePath: formattedPreviousFilePath,
    currentFilePath: formattedCurrentFilePath,
  };
};

type CompareChangesInJsonsBetweenVersionsArgs = {
  projectAbsolutePath: string;
  filePath: string;
  objectProperties: string[];
};

export const compareChangesInJsonsBetweenVersions = async ({
  projectAbsolutePath,
  filePath,
  objectProperties,
}: CompareChangesInJsonsBetweenVersionsArgs) => {
  const { previousFilePath, currentFilePath } = getCurrentAndPreviousFilePaths({
    projectAbsolutePath,
    filePath,
  });

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
