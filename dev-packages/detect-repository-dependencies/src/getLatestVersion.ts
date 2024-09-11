import { NPMRegistry, LatestVersion } from "@packages/detect-repository-dependencies-types";

type GetLatestVersionArgs = {
  data: NPMRegistry[];
};

export const getLatestVersion = ({ data }: GetLatestVersionArgs) => {
  const latestVersions: LatestVersion = {};

  data.forEach((pack) => {
    const name = pack.name;
    const latestVersion = pack?.["dist-tags"]?.latest;
    const releaseDate = pack?.time?.[latestVersion];

    latestVersions[name] = {
      version: latestVersion,
      date: releaseDate,
    };
  });

  return latestVersions;
};
