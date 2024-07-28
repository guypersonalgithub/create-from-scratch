import { readdirSync, writeFileSync } from "fs";
import { detectUsedLocalPackages } from "../packages/detectUsedLocalPackages";
import { getProjectAbsolutePath } from "@packages/paths";
import { getContainerProperties } from "./getContainerProperties";
import {
  detectRepositoryPackageManager,
  getPackageManagerInstallCommand,
  getPackageManagerProductionInstallCommand,
  getPackageManagerRunScriptCommand,
} from "../packageManager";

const lineSeparator = "\n";
const debugFilesCommand = `["sh", "-c", "while :; do sleep 2073600; done"]`;

export const generateDockerfileDev = () => {
  // Currently this script has both dev and prod commands, later on they will be separated into different files.
  console.log("Generating new Dockerfiles for each workspace");

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/apps`;
  const workspaces = readdirSync(folderPath);
  const runCommand = getPackageManagerRunScriptCommand();
  const devCommand = `${runCommand} dev`;
  const prodCommand = `${runCommand} build`;
  const formattedDevCommand = convertCommandToDockerCMD({ command: devCommand });
  const formattedProdCommand = convertCommandToDockerCMD({ command: prodCommand });
  const packageManager = detectRepositoryPackageManager();
  const developmentInstallCommand = getPackageManagerInstallCommand({ packageManager });
  const productionInstallCommand = getPackageManagerProductionInstallCommand({ packageManager });

  workspaces.forEach((workspace) => {
    const workspaceContainerProperties = getContainerProperties({
      folderPath,
      workspace,
    });

    if (!workspaceContainerProperties) {
      console.error(`Skipping ${workspace} due to missing configurations.`);
      return;
    }

    const { main } = workspaceContainerProperties;
    const { image, skip } = main;

    generateDockerfiles({
      projectAbsolutePath,
      workspace,
      image,
      devCommand: formattedDevCommand,
      prodCommand: formattedProdCommand,
      skip,
      developmentInstallCommand,
      productionInstallCommand,
    });
    generateNonAppsDockerfiles({
      projectAbsolutePath,
      folderPath,
      workspace,
      developmentInstallCommand,
      productionInstallCommand,
    });
  });
};

type GenerateDockerfilesArgs = {
  projectAbsolutePath: string;
  workspace: string;
  container?: string;
  fileName?: string;
  image?: string;
  files?: string[];
  target?: string;
  devCommand: string;
  prodCommand: string;
  skip?: string[];
  developmentInstallCommand: string;
  productionInstallCommand: string;
};

const generateDockerfiles = ({
  projectAbsolutePath,
  workspace,
  container = workspace,
  fileName = "package.json",
  image = "node:20.11.0-alpine3.19",
  files,
  target,
  devCommand,
  prodCommand,
  skip = [],
  developmentInstallCommand,
  productionInstallCommand,
}: GenerateDockerfilesArgs) => {
  const workspacePackages = detectUsedLocalPackages({
    workspace: `apps/${workspace}`,
    projectAbsolutePath,
    fileName,
  });

  const formattedWorkspacePackagesPaths = workspacePackages.map((workspacePackage) => {
    return workspacePackage.path;
  });

  const filteredPackagesArray = workspacePackages.filter((pack) => {
    return !skip.includes(pack.name);
  });

  const packagesArrayPackageJsons = filteredPackagesArray.map((workspacePackage) => {
    const workspacePackagePackageJsonPath = `./${workspacePackage.path}/package.json`;
    return `COPY ${workspacePackagePackageJsonPath} ${workspacePackagePackageJsonPath}`;
  });

  const isUniqueFile = fileName !== "package.json";

  const dockerfileCommandsBase = [
    `FROM ${image} AS base`,
    "WORKDIR /usr/src/app",
    `COPY ./apps/${workspace}/${isUniqueFile ? fileName : "package.json"} ./package.json`,
    `COPY ./apps/${workspace}/package-lock.json ./package-lock.json`,
    `COPY ./apps/${workspace}/package.json ./apps/${workspace}/package.json`,
    isUniqueFile ? `COPY ./apps/${workspace}/${fileName} ./package.json` : null,
    ...packagesArrayPackageJsons,
  ].filter((command) => command);

  const dockerfileCommandsDev = generateDockerfileCommandsLayer({
    layerName: "development",
    dependenciesInstallCommand: developmentInstallCommand,
    workspace,
    files,
    target,
    workspacePackages: formattedWorkspacePackagesPaths,
    command: devCommand,
    skip,
  });

  const dockerfileCommandsProd = generateDockerfileCommandsLayer({
    layerName: "production",
    dependenciesInstallCommand: productionInstallCommand,
    workspace,
    files,
    target,
    workspacePackages: formattedWorkspacePackagesPaths,
    command: prodCommand,
    skip,
  });

  const dockerfileCommandsDebugFiles = generateDockerfileCommandsLayer({
    layerName: "debugFiles",
    dependenciesInstallCommand: developmentInstallCommand,
    workspace,
    files,
    target,
    workspacePackages: formattedWorkspacePackagesPaths,
    command: debugFilesCommand,
    skip,
  });

  const layerSeparator = [lineSeparator, lineSeparator, lineSeparator, lineSeparator].join("");

  const completeDockerfileCommands =
    dockerfileCommandsBase.join(lineSeparator) +
    layerSeparator +
    dockerfileCommandsDev.filter((command) => command).join(lineSeparator) +
    layerSeparator +
    dockerfileCommandsProd.filter((command) => command).join(lineSeparator) +
    layerSeparator +
    dockerfileCommandsDebugFiles.filter((command) => command).join(lineSeparator);

  writeFileSync(
    `${projectAbsolutePath}/docker/Dockerfile.${container}`,
    completeDockerfileCommands,
  );
};

type GenerateDockerfileCommandsLayer = {
  fromLayer?: string;
  layerName: string;
  dependenciesInstallCommand: string;
  workspace: string;
  files?: string[];
  target?: string;
  workspacePackages: string[];
  command: string;
  skip?: string[];
};

const generateDockerfileCommandsLayer = ({
  fromLayer = "base",
  layerName,
  dependenciesInstallCommand,
  workspace,
  files = [],
  target = "./",
  workspacePackages,
  command,
  skip = [],
}: GenerateDockerfileCommandsLayer) => {
  const workingFolder = `./apps/${workspace}`;
  const copiedFiles =
    files.length > 0 ? files.map((file) => `${workingFolder}/${file}`).join(", ") : workingFolder;

  const dependenciesUninstall = skip.join(" ");

  const dependencies = workspacePackages.map((workspacePackage) => {
    const workspacePackagePath = `./${workspacePackage}`;
    return `COPY ${workspacePackagePath} ${workspacePackagePath}`;
  });

  return [
    `FROM ${fromLayer} as ${layerName}`,
    "WORKDIR /usr/src/app",
    `ENV NODE_ENV ${layerName}`,
    skip.length > 0 ? `RUN npm uninstall ${dependenciesUninstall}` : null,
    `RUN --mount=type=cache,target=/usr/src/app/.npm \\ \n    npm set cache /usr/src/app/.npm && \\ \n    ${dependenciesInstallCommand}`,
    "USER node",
    `COPY --chown=node:node ${copiedFiles} ${target}`,
    ...dependencies,
    `CMD ${command}`,
  ];
};

type GenerateNonAppsDockerfilesArgs = {
  projectAbsolutePath: string;
  workspace: string;
  folderPath: string;
  developmentInstallCommand: string;
  productionInstallCommand: string;
};

const generateNonAppsDockerfiles = ({
  projectAbsolutePath,
  workspace,
  folderPath,
  developmentInstallCommand,
  productionInstallCommand,
}: GenerateNonAppsDockerfilesArgs) => {
  const workspaceContainerProperties = getContainerProperties({
    folderPath,
    workspace,
  });

  const folderRootFiles = readdirSync(`${folderPath}/${workspace}`);

  for (const container in workspaceContainerProperties) {
    if (container === "main") {
      continue;
    }

    const containerFileName = `${container}.container.json`;
    const containerJsonExists = folderRootFiles.includes(containerFileName);
    if (!containerJsonExists) {
      continue;
    }

    const {
      image,
      files,
      target,
      startCommandDev = [],
      startCommandProd = [],
    } = workspaceContainerProperties[container];
    const formattedDevCommand = startCommandDev.reduce((str, current, index) => {
      const isLastIndex = index === startCommandDev.length - 1;
      return str + `\"${current}\"${!isLastIndex ? ", " : "]"}`;
    }, "[");

    const formattedProdCommand = startCommandProd.reduce((str, current, index) => {
      const isLastIndex = index === startCommandProd.length - 1;
      return str + `\"${current}\"${!isLastIndex ? ", " : "]"}`;
    }, "[");

    generateDockerfiles({
      projectAbsolutePath,
      workspace,
      container: `${workspace}-${container}`,
      fileName: containerFileName,
      image,
      files,
      target: `./${target}`,
      devCommand: formattedDevCommand,
      prodCommand: formattedProdCommand,
      developmentInstallCommand,
      productionInstallCommand,
    });
  }
};

type ConvertCommandToDockerCMDArgs = {
  command: string;
};

const convertCommandToDockerCMD = ({ command }: ConvertCommandToDockerCMDArgs) => {
  const formattedCommand = command
    .split(" ")
    .map((part) => {
      return `"${part}"`;
    })
    .join(", ");

  return `[${formattedCommand}]`;
};
