import { sep, join } from "path";

type MergePathsArgs = {
  path1: string;
  path1Separator?: string;
  path2: string;
  path2Separator?: string;
};

export const mergePaths = ({
  path1,
  path1Separator = sep,
  path2,
  path2Separator = sep,
}: MergePathsArgs) => {
  const parts1 = path1.split(path1Separator);
  const parts2 = path2.split(path2Separator);

  let overlapIndex = -1;

  for (let i = 0; i <= parts1.length; i++) {
    const currentPart1 = parts1[parts1.length - i - 1];
    const currentPart2 = parts2[i];

    if (currentPart1 !== currentPart2) {
      break;
    }

    overlapIndex = i;
  }

  if (overlapIndex === -1) {
    return join(path1, path2);
  }

  const mergedPath = join(path1, parts2.slice(overlapIndex + 1).join(sep));

  return mergedPath;
};
