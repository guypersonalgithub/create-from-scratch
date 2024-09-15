import "@packages/fetch-management";
import { DetectDependenciesRoute } from "@packages/package-manager-shared-types";
import { Data } from "./types";
import { LatestVersion, NPMRegistry } from "@packages/detect-repository-dependencies-types";

declare module "@packages/fetch-management" {
  interface BaseRequestTypeRegistry {
    dependencies: {
      data: Data;
      callbackArgument: DetectDependenciesRoute;
    };
    dependencyVersions: {
      data: LatestVersion;
      callbackArgument: { data: LatestVersion };
    };
    specificDependency: {
      data: NPMRegistry;
      callbackArgument: { data: NPMRegistry };
    };
  }
}
