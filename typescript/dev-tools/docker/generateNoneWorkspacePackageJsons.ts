import { readFileSync, writeFileSync } from "fs";
import { getContainerProperties } from "./getContainerProperties";
import { WorkspaceContainerProperties } from "./types";

type GenerateNoneWorkspacePackageJsonsArgs = {
  folderPath: string;
  workspace: string;
};

export const generateNoneWorkspacePackageJsons = ({
  folderPath,
  workspace,
}: GenerateNoneWorkspacePackageJsonsArgs) => {
  const containerProperties = getContainerProperties({ folderPath, workspace });
  if (!containerProperties) {
    console.error(`Skipping ${workspace} due to missing configurations.`);
    return;
  }

  const shouldContinue = packageJsonContainerExists({ containerProperties });
  if (!shouldContinue) {
    return;
  }

  const workspacePackageJson = readFileSync(
    `${folderPath}/${workspace}/package.json`,
    {
      encoding: "utf-8",
      flag: "r",
    }
  );

  const parsedData = JSON.parse(workspacePackageJson);
  const {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
  } = parsedData;
  const existingPackageVersions: Record<string, string> = {
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
  };

  for (const container in containerProperties) {
    if (container === "main") {
      continue;
    }

    const containerData = containerProperties[container];
    const packageJsonRequired = requiresPackageJson({ containerData });
    if (!packageJsonRequired) {
      continue;
    }

    const {
      dependencies = [],
      devDependencies = [],
      peerDependencies = [],
      scripts = {},
    } = containerData;

    writeFileSync(
      `${folderPath}/${workspace}/${container}.container.json`,
      JSON.stringify(
        {
          name: container,
          scripts,
          dependencies: getDependencyDictionary({
            dependencies,
            existingPackageVersions,
          }),
          devDependencies: getDependencyDictionary({
            dependencies: devDependencies,
            existingPackageVersions,
          }),
          peerDependencies: getDependencyDictionary({
            dependencies: peerDependencies,
            existingPackageVersions,
          }),
        },
        null,
        2
      )
    );
  }
};

type PackageJsonContainerExistsArgs = {
  containerProperties: WorkspaceContainerProperties;
};

const packageJsonContainerExists = ({
  containerProperties,
}: PackageJsonContainerExistsArgs) => {
  for (const container in containerProperties) {
    if (container === "main") {
      continue;
    }

    const containerData = containerProperties[container];
    const packageJsonRequired = requiresPackageJson({ containerData });
    if (packageJsonRequired) {
      return true;
    }
  }

  return false;
};

type RequiresPackageJsonArgs = {
  containerData: WorkspaceContainerProperties[string];
};

const requiresPackageJson = ({ containerData }: RequiresPackageJsonArgs) => {
  const {
    dependencies = [],
    devDependencies = [],
    peerDependencies = [],
  } = containerData;

  return (
    dependencies.length > 0 ||
    devDependencies.length > 0 ||
    peerDependencies.length > 0
  );
};

type GetDependencyDictionaryArgs = {
  dependencies?: string[];
  existingPackageVersions: Record<string, string>;
};

const getDependencyDictionary = ({
  dependencies = [],
  existingPackageVersions,
}: GetDependencyDictionaryArgs) => {
  if (!dependencies || dependencies.length === 0) {
    return;
  }

  const dependencyDictionary: Record<string, string> = {};
  dependencies.forEach((dependency) => {
    const version = existingPackageVersions[dependency];
    dependencyDictionary[dependency] = version;
  });

  return dependencyDictionary;
};
