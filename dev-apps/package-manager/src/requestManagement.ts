import "@packages/fetch-management";
import { DetectDependenciesRoute } from "@packages/package-manager-shared-types";
import { ParsedData } from "./types";
import { LatestVersion, NPMRegistry } from "@packages/detect-repository-dependencies-types";
import { DependenciesToChange } from "@packages/alter-package-versions-types";

declare module "@packages/fetch-management" {
  interface BaseRequestTypeRegistry {
    dependencies: {
      data: ParsedData;
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

  interface BaseActionTypeRegistry {
    updateDependency: {
      body: DependenciesToChange;
      callbackArgument: {
        data: DetectDependenciesRoute["data"];
        failures?: string[];
      };
    };
  }
}
