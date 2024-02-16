const getPrivatePackageDependencies = (
  dependencies,
  privatePackages,
  localPackage
) => {
  for (const dependency in dependencies) {
    if (dependency.includes(localPackage)) {
      const dependencyFolder = dependency.replace(`${localPackage}/`, "");
      privatePackages.push(`./packages/${dependencyFolder}`);
    }
  }
};

module.exports = {
  getPrivatePackageDependencies,
};
