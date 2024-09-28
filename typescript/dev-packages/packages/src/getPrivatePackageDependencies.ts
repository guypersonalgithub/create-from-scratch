import { recursiveLocalPackagesDetection } from "./detectUsedLocalPackages";

type getPrivatePackageDependenciesArgs = {
  dependencies: Record<string, string>;
  privatePackages: Map<
    string,
    {
      path: string;
      name: string;
    }
  >;
  localPackage: string;
  projectAbsolutePath: string;
  parsedRootPackageLock: Record<
    string,
    {
      resolved: string;
      link: boolean;
    }
  >;
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
