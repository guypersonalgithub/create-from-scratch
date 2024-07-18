import { RouterPaths } from "./types";

type GrabFirstPathsArgs = {
  currentStage: RouterPaths;
};

export const grabFirstPath = ({ currentStage }: GrabFirstPathsArgs) => {
  for (const path in currentStage) {
    return path;
  }

  return;
};
