import { recursiveLocalPackagesDetection } from "./detectUsedLocalPackages";
import { LocalPackageMetadata, PackageLockPackages } from "./types";

type getPrivatePackageDependenciesArgs = {
  dependencies: Record<string, string>;
  privatePackages: Map<string, LocalPackageMetadata>;
  localPackage: string;
  projectAbsolutePath: string;
  parsedRootPackageLock: PackageLockPackages;
};

export const getPrivatePackageDependencies = ({
  dependencies,
  privatePackages,
  localPackage,
  projectAbsolutePath,
  parsedRootPackageLock,
}: getPrivatePackageDependenciesArgs) => {
  for (const dependency in dependencies) {
    if (dependency.includes(localPackage)) {
      const nodeModulesLocalPackage = `node_modules/${dependency}`;
      const { resolved } = parsedRootPackageLock[nodeModulesLocalPackage];
      if (privatePackages.has(dependency)) {
        // TODO: Detect circular dependencies.
        continue;
      }
      privatePackages.set(dependency, {
        path: resolved,
        name: dependency,
      });
      recursiveLocalPackagesDetection({
        workspace: resolved,
        existingPrivatePackages: privatePackages,
        projectAbsolutePath,
        parsedRootPackageLock,
      });
    }
  }
};
