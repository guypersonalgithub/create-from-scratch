import { readFileSync } from "fs";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

const frontendPackages = [
  "react",
  "react-dom",
  "vue",
  "angular",
  "@angular/core",
  "svelte",
  "webpack",
  "parcel",
  "vite",
];

const backendPackages = [
  "express",
  "koa",
  "hapi",
  "fastify",
  "nestjs",
  "sails",
  "loopback",
  "mongoose",
  "sequelize",
];

const frontendScripts = ["react-scripts", "ng", "vue-cli-service", "vite"];
const backendScripts = ["nodemon", "ts-node", "pm2"];

type DetectPackageEnvironmentArgs = {
  path: string;
};

export const detectPackageEnvironment = ({ path }: DetectPackageEnvironmentArgs) => {
  const packageJson: PackageJson = JSON.parse(readFileSync(path, "utf-8"));
  const { dependencies = {}, devDependencies = {}, scripts = {} } = packageJson;

  let isFrontend = false;
  let isBackend = false;

  const { dev = "" } = scripts;

  if (frontendPackages.some((fs) => dev.includes(fs))) {
    isFrontend = true;
  }

  if (isFrontend) {
    return "frontend";
  }

  const allDependencies = { ...dependencies, ...devDependencies };
  for (const dep of Object.keys(allDependencies)) {
    if (frontendPackages.includes(dep)) {
      isFrontend = true;
    }
    if (backendPackages.includes(dep)) {
      isBackend = true;
    }
  }

  for (const script of Object.values(scripts)) {
    if (frontendScripts.some((fs) => script.includes(fs))) {
      isFrontend = true;
    }
    if (backendScripts.some((bs) => script.includes(bs))) {
      isBackend = true;
    }
  }

  if (isFrontend && !isBackend) {
    return "frontend";
  }
  if (isBackend && !isFrontend) {
    return "backend";
  }
  if (isFrontend && isBackend) {
    return "fullstack";
  }

  return "unknown";
};
