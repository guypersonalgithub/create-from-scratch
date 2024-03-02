type getPrivatePackageDependenciesArgs = {
  dependencies: Record<string, string>;
  privatePackages: string[];
  localPackage: string;
};

export const getPrivatePackageDependencies = ({
  dependencies,
  privatePackages,
  localPackage,
}: getPrivatePackageDependenciesArgs) => {
  for (const dependency in dependencies) {
    if (dependency.includes(localPackage)) {
      const dependencyFolder = dependency.replace(`${localPackage}/`, "");
      privatePackages.push(`packages/${dependencyFolder}`);
    }
  }
};
