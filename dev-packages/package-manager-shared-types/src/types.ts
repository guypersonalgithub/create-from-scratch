import type {
  DependenciesMap,
  LatestVersion,
} from "@packages/detect-repository-dependencies-types";

export type DetectDependenciesRoute = {
  data: DependenciesMap;
  latestVersions: LatestVersion;
};
