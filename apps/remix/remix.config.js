import pjson from "./package.json" with { type: "json"};

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

    for (const dependency in dependencies) {
      if (dependency.includes(localPackage)) {
        const dependencyFolder = dependency.replace(`${localPackage}/`, "");
        hotReloadPackages.push(`./packages/${dependencyFolder}`);
      }
    }

    for (const dependency in devDependencies) {
      if (dependency.includes(localPackage)) {
        const dependencyFolder = dependency.replace(`${localPackage}/`, "");
        hotReloadPackages.push(`./packages/${dependencyFolder}`);
      }
    }

    return hotReloadPackages;
  },
};
