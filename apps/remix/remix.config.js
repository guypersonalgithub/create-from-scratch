import pjson from "./package.json" with { type: "json"};
import fs from "fs";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [/^@packages.*/],
  watchPaths: async () => {
    const localPackage = "@packages";
    const hotReloadPackages = [];
    const { dependencies, devDependencies } = pjson;

    getPrivatePackageDependencies({  
      dependencies,
      privatePackages: hotReloadPackages,
      localPackage,
    });

    getPrivatePackageDependencies({  
      dependencies: devDependencies,
      privatePackages: hotReloadPackages,
      localPackage,
    });

    return hotReloadPackages;
  },
};

const detectPackages = ({
  workspace,
  existingPrivatePackages = [],
}) => {
  const file = fs.readFileSync(`${workspace}/package.json`, {
    encoding: "utf8",
    flag: "r",
  });

  const parsedFile = JSON.parse(file);

  const localPackage = "@packages";
  const privatePackages = existingPrivatePackages;
  const { dependencies, devDependencies } = parsedFile;

  getPrivatePackageDependencies({
    dependencies,
    privatePackages,
    localPackage,
  });
  getPrivatePackageDependencies({
    dependencies: devDependencies,
    privatePackages,
    localPackage,
  });

  return privatePackages;
}

const getPrivatePackageDependencies = ({
  dependencies,
  privatePackages,
  localPackage,
}) => {
  for (const dependency in dependencies) {
    if (dependency.includes(localPackage)) {
      const dependencyFolder = dependency.replace(`${localPackage}/`, "");
      privatePackages.push(`packages/${dependencyFolder}`);
      detectPackages({
        workspace: `./packages/${dependencyFolder}`,
        existingPrivatePackages: privatePackages,
      });
    }
  }
};