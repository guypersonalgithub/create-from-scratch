import { detectWorkspacePackages } from "../packages/detectWorkspacePackages";

type getPrivatePackageDependenciesArgs = {
  dependencies: Record<string, string>;
  privatePackages: string[];
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
      privatePackages.push(`packages/${dependencyFolder}`);
      detectWorkspacePackages({
        workspace: `packages/${dependencyFolder}`,
        existingPrivatePackages: privatePackages,
        projectAbsolutePath,
      });
    }
  }
};
