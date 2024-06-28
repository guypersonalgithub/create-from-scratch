import { readdirSync, writeFileSync } from "fs";
import { detectWorkspacePackages } from "../packages/detectWorkspacePackages";
import { getProjectAbsolutePath } from "../paths";
import { getContainerProperties } from "./getContainerProperties";
import {
  detectRepositoryPackageManager,
  getPackageManagerInstallCommand,
  getPackageManagerProductionInstallCommand,
  getPackageManagerRunScriptCommand,
} from "../packageManager";

const lineSeparator = "\n\n";
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
  const workspacePackages = detectWorkspacePackages({
    workspace: `apps/${workspace}`,
    projectAbsolutePath,
    fileName,
  });

  if (!workspacePackages) {
    console.error(`Skipping ${workspace} due to missing configurations.`);
    return;
  }

  const localPackagesFormat = "@packages";
  const formattedSkip = skip.map((skip) => {
    if (skip.includes(localPackagesFormat)) {
      return skip.replace(localPackagesFormat, "packages");
    }

    return skip;
  });

  const workspacePackagesArray = [...workspacePackages];

  const workspacePackagesString = workspacePackagesArray
    .filter((pack) => !formattedSkip.includes(pack))
    .map((pack) => `./${pack}`)
    .join(" ");

  const isUniqueFile = fileName !== "package.json";

  const dockerfileCommandsBase = [
    `FROM ${image} AS base`,
    "WORKDIR /usr/src/app",
    `COPY ./apps/${workspace}/package-lock.json ${
      !isUniqueFile ? `./apps/${workspace}/package.json ` : ""
    }./`,
    isUniqueFile ? `ADD ./apps/${workspace}/${fileName} ./package.json` : null,
  ].filter((command) => command);

  const dockerfileCommandsDev = generateDockerfileCommandsLayer({
    nodeEnvironment: "development",
    dependenciesInstallCommand: developmentInstallCommand,
    workspace,
    files,
    target,
    workspacePackages: workspacePackagesArray,
    workspacePackagesString,
    command: devCommand,
    skip,
  });

  const dockerfileCommandsProd = generateDockerfileCommandsLayer({
    nodeEnvironment: "production",
    dependenciesInstallCommand: productionInstallCommand,
    workspace,
    files,
    target,
    workspacePackages: workspacePackagesArray,
    workspacePackagesString,
    command: prodCommand,
    skip,
  });

  const dockerfileCommandsDebugFiles = generateDockerfileCommandsLayer({
    nodeEnvironment: "debugFiles",
    dependenciesInstallCommand: developmentInstallCommand,
    workspace,
    files,
    target,
    workspacePackages: workspacePackagesArray,
    workspacePackagesString,
    command: debugFilesCommand,
    skip,
  });

  const completeDockerfileCommands =
    dockerfileCommandsBase.join(lineSeparator) +
    lineSeparator +
    lineSeparator +
    dockerfileCommandsDev.filter((command) => command).join(lineSeparator) +
    lineSeparator +
    lineSeparator +
    dockerfileCommandsProd.filter((command) => command).join(lineSeparator) +
    lineSeparator +
    lineSeparator +
    dockerfileCommandsDebugFiles.filter((command) => command).join(lineSeparator);

  writeFileSync(
    `${projectAbsolutePath}/docker/Dockerfile.${container}`,
    completeDockerfileCommands,
  );
};

type GenerateDockerfileCommandsLayer = {
  nodeEnvironment: string;
  dependenciesInstallCommand: string;
  workspace: string;
  files?: string[];
  target?: string;
  workspacePackages: string[];
  workspacePackagesString: string;
  command: string;
  skip?: string[];
};

const generateDockerfileCommandsLayer = ({
  nodeEnvironment,
  dependenciesInstallCommand,
  workspace,
  files = [],
  target = "./",
  workspacePackages,
  workspacePackagesString,
  command,
  skip = [],
}: GenerateDockerfileCommandsLayer) => {
  const workingFolder = `./apps/${workspace}`;
  const copiedFiles =
    files.length > 0 ? files.map((file) => `${workingFolder}/${file}`).join(", ") : workingFolder;

  const dependenciesUninstall = skip.join(" ");

  return [
    `FROM base as ${nodeEnvironment}`,
    "WORKDIR /usr/src/app",
    `ENV NODE_ENV ${nodeEnvironment}`,
    skip.length > 0 ? `RUN npm uninstall ${dependenciesUninstall}` : null,
    `RUN --mount=type=cache,target=/usr/src/app/.npm \\ \n    npm set cache /usr/src/app/.npm && \\ \n    ${dependenciesInstallCommand}`,
    "USER node",
    `COPY --chown=node:node ${copiedFiles} ${target}`,
    workspacePackages.length > 0
      ? `COPY --chown=node:node ${workspacePackagesString} ./packages/`
      : null,
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
