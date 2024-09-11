import {
  detectAllRepositoryDependencies,
  getLatestVersion,
  getPackageVersions,
} from "@packages/detect-repository-dependencies";
import { NPMRegistry } from "@packages/detect-repository-dependencies-types";

type GetVersionsOfCurrentPaginationArgs = {
  paginationValue: number;
  cachedDependencies:
    | ReturnType<typeof detectAllRepositoryDependencies>["dependencies"]
    | undefined;
};

export const getVersionsOfCurrentPagination = async ({
  paginationValue,
  cachedDependencies,
}: GetVersionsOfCurrentPaginationArgs) => {
  if (!Number.isNaN(paginationValue)) {
    const startingIndex = (paginationValue - 1) * 10;
    const endingIndex = startingIndex + 10;

    const parsedDependencies = Object.entries(cachedDependencies ?? {}).map(([key, value]) => {
      return {
        name: key,
        isLocal: value.isLocal,
      };
    });

    const packageNames = parsedDependencies
      .slice(startingIndex, endingIndex)
      .filter((row) => !row.isLocal)
      .map((pack) => pack.name);

    return fetchPackageLatestVersions({ packageNames });
  }
};

type FetchPackageLatestVersionsArgs = {
  packageNames: string[];
};

export const fetchPackageLatestVersions = async ({ packageNames }: FetchPackageLatestVersionsArgs) => {
  const data = await Promise.all(
    packageNames.map((packageName) => {
      return getPackageVersions({ packageName });
    }),
  );

  const responses = data.map((res) => res?.response);

  const latestVersions = getLatestVersion({
    data: responses.filter(Boolean) as NPMRegistry[],
  });

  return latestVersions;
};
