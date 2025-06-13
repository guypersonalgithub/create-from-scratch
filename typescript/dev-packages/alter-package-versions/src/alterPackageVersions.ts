import { getFile } from "@packages/files";
import { writeFileSync } from "fs";
import { type DependenciesToChange } from "@packages/alter-package-versions-types";

type AlterPackageVersionsArgs = {
  dependenciesToChange: DependenciesToChange;
};

export const alterPackageVersions = ({ dependenciesToChange }: AlterPackageVersionsArgs) => {
  const failures: string[] = [];

  try {
    for (const path in dependenciesToChange) {
      const file = getFile({ path });
      if (!file) {
        failures.push(`Failed to find the file ${path}.`);
        continue;
      }

      const parsedFile = JSON.parse(file);

      const dependenciesToUpdate = dependenciesToChange[path];
      for (let i = 0; i < dependenciesToUpdate.length; i++) {
        const { dependencyType, dependency, newVersion } = dependenciesToUpdate[i];

        const dependencyTypeDependencies = parsedFile[dependencyType];
        if (!dependencyTypeDependencies) {
          failures.push(`Failed to find the ${dependencyType} in the file ${path}.`);
          continue;
        }

        const currentDependency = dependencyTypeDependencies[dependency];
        if (!currentDependency) {
          failures.push(
            `Failed to find the dependency ${dependency} in the ${dependencyType} section.`,
          );
          continue;
        }

        parsedFile[dependencyType][dependency] = newVersion;
      }

      writeFileSync(path, JSON.stringify(parsedFile, null, 2));
    }
  } catch (error) {
  } finally {
    return failures;
  }
};
