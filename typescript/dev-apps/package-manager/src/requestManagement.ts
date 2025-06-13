import "@packages/fetch-management";
import { type DetectDependenciesRoute } from "@packages/package-manager-shared-types";
import { type ParsedData } from "./types";
import {
  type LatestVersion,
  type NPMRegistry,
} from "@packages/detect-repository-dependencies-types";
import { type DependenciesToChange } from "@packages/alter-package-versions-types";

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
