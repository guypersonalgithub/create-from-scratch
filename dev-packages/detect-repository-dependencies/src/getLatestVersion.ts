import { NPMRegistry, LatestVersion } from "@packages/detect-repository-dependencies-types";

type GetLatestVersionArgs = {
  data: NPMRegistry[];
};

export const getLatestVersion = ({ data }: GetLatestVersionArgs) => {
  const parsedData = data.map((pack) => {
    const name = pack.name;
    const latestVersion = pack?.["dist-tags"]?.latest;
    const releaseDate = pack?.time?.[latestVersion];

    return {
      name,
      version: latestVersion,
      date: releaseDate,
    } satisfies LatestVersion[number];
  });

  return parsedData;
};
