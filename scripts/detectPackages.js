const fs = require("fs");
const { getCommandFlags } = require("./utils/getCommandFlags");
const {
  getPrivatePackageDependencies,
} = require("./utils/getPrivatePackageDependencies");

const detectPackages = () => {
  const flagMap = getCommandFlags();

  const workSpace = flagMap.get("workspace");

  const file = fs.readFileSync(`../${workSpace}/package.json`, {
    encoding: "utf8",
    flag: "r",
  });

  const parsedFile = JSON.parse(file);

  const localPackage = "@packages";
  const privatePackages = [];
  const { dependencies, devDependencies } = parsedFile;

  getPrivatePackageDependencies(dependencies, privatePackages, localPackage);
  getPrivatePackageDependencies(devDependencies, privatePackages, localPackage);

  return privatePackages.join(" ");
};

detectPackages();
