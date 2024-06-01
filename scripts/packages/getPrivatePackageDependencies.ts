import { detectWorkspacePackages } from "./detectWorkspacePackages";

type getPrivatePackageDependenciesArgs = {
  dependencies: Record<string, string>;
  privatePackages: Set<string>;
  localPackage: string;
  projectAbsolutePath: string;
};

export const getPrivatePackageDependencies = ({
  dependencies,
  privatePackages,
  localPackage,
  projectAbsolutePath,
}: getPrivatePackageDependenciesArgs) => {
  for (const dependency in dependencies) {
    if (dependency.includes(localPackage)) {
      const dependencyFolder = dependency.replace(`${localPackage}/`, "");
      privatePackages.add(`packages/${dependencyFolder}`);
      detectWorkspacePackages({
        workspace: `packages/${dependencyFolder}`,
        existingPrivatePackages: privatePackages,
        projectAbsolutePath,
      });
    }
  }
};
