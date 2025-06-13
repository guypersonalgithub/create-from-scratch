import { type PackageJson } from "@packages/package-json";

type DeleteLocalPackageDependenciesArgs = {
  packageJson: PackageJson;
  localPackageIdentifier: string;
};

export const deleteLocalPackageDependencies = ({
  packageJson,
  localPackageIdentifier,
}: DeleteLocalPackageDependenciesArgs) => {
  const { dependencies, devDependencies, optionalDependencies, peerDependencies } = packageJson;

  deleteLocalPackages({ dependencies, localPackageIdentifier });
  deleteLocalPackages({ dependencies: devDependencies, localPackageIdentifier });
  deleteLocalPackages({ dependencies: optionalDependencies, localPackageIdentifier });
  deleteLocalPackages({ dependencies: peerDependencies, localPackageIdentifier });

  return { dependencies, devDependencies, optionalDependencies, peerDependencies };
};

type DeleteLocalPackagesArgs = {
  dependencies: PackageJson["dependencies"];
  localPackageIdentifier: string;
};

const deleteLocalPackages = ({ dependencies, localPackageIdentifier }: DeleteLocalPackagesArgs) => {
  if (!dependencies) {
    return;
  }

  for (const dependency in dependencies) {
    if (dependency.startsWith(localPackageIdentifier)) {
      delete dependencies[dependency];
    }
  }
};
