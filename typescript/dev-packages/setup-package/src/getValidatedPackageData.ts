import { getPackageJson } from "@packages/package-json";
import { detectCircularDependencies, detectUsedLocalPackages } from "@packages/packages";
import { getTSconfig } from "@packages/tsconfig";

type GetValidatedPackageDataArgs = {
  path: string;
  localPackageIdentifier: string;
  projectAbsolutePath: string;
  completePath: string;
};

export const getValidatedPackageData = ({
  path,
  localPackageIdentifier,
  projectAbsolutePath,
  completePath,
}: GetValidatedPackageDataArgs) => {
  const problematicPackages =
    detectCircularDependencies({ hideLogs: true, parsePaths: true }) || [];
  const packageNames = problematicPackages.map((problematicPackage) =>
    problematicPackage.replace(`${localPackageIdentifier}/`, ""),
  );

  const localDependencies = detectUsedLocalPackages({
    workspace: path,
    projectAbsolutePath,
  });

  const localDependenciesNames = localDependencies.map((pack) =>
    pack.name.replace(`${localPackageIdentifier}/`, ""),
  );

  const splitPackagePath = path.split("/");
  const currentPackageName = splitPackagePath[splitPackagePath.length - 1];
  if (packageNames.includes(currentPackageName)) {
    throw new Error(
      `The requested package ${currentPackageName} was found to have a recursive dependency, thus the process was rejected.`,
    );
  }

  const hasRecursiveDependency = localDependenciesNames.find((localDependency) =>
    packageNames.includes(localDependency),
  );
  if (hasRecursiveDependency) {
    throw new Error(
      `One of the requested package's local dependencies ${hasRecursiveDependency} was found to have a recursive dependency, thus the process was rejected.`,
    );
  }

  const packageJson = getPackageJson({ folderPath: completePath });
  if (!packageJson) {
    throw `Package json for ${path} was not found`;
  }

  const tsconfig = getTSconfig({ packagePath: completePath });
  if (!tsconfig) {
    throw `Tsconfig for ${path} was not found`;
  }

  return {
    currentPackageName,
    localDependencies,
    packageJson,
    tsconfig,
  };
};
