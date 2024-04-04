import { readdirSync, writeFileSync } from "fs";
import { detectWorkspacePackages } from "../packages/detectWorkspacePackages";
import { getProjectAbsolutePath } from "../utils";
import { getContainerProperties } from "../utils/getContainerProperties";

const lineSeparator = "\n\n";

export const generateDockerfileDev = () => {
  // Currently this script has both dev and prod commands, later on they will be separated into different files.
  console.log("Generating new Dockerfiles for each workspace");

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/apps`;
  const workspaces = readdirSync(folderPath);
  workspaces.forEach((workspace) => {
    const workspaceContainerProperties = getContainerProperties({
      folderPath,
      workspace,
    });

    const { main } = workspaceContainerProperties;
    const { skip } = main;

    generateDockerfiles({
      projectAbsolutePath,
      workspace,
      devCommand: `["npm", "run", "dev"]`,
      prodCommand: `["npm", "run", "build"]`,
      skip,
    });
    generateNonAppsDockerfiles({ projectAbsolutePath, folderPath, workspace });
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
}: GenerateDockerfilesArgs) => {
  const workspacePackages = detectWorkspacePackages({
    workspace: `apps/${workspace}`,
    projectAbsolutePath,
    fileName,
  });

  const localPackagesFormat = "@packages";
  const formattedSkip = skip.map((skip) => {
    if (skip.includes(localPackagesFormat)) {
      return skip.replace(localPackagesFormat, "packages");
    }

    return skip;
  });

  const workspacePackagesString = workspacePackages
    .filter((pack) => !formattedSkip.includes(pack))
    .map((pack) => `./${pack}`)
    .join(" ");

  const isUniqueFile = fileName !== "package.json";

  const dockerfileCommandsBase = [
    `FROM ${image} AS base`,
    "WORKDIR /usr/src/app",
    `COPY ./package-lock.json ${
      !isUniqueFile ? `./apps/${workspace}/package.json ` : ""
    }./`,
    isUniqueFile ? `ADD ./apps/${workspace}/${fileName} ./package.json` : null,
  ].filter((command) => command);

  const dockerfileCommandsDev = generateDockerfileCommandsLayer({
    nodeEnvironment: "development",
    dependenciesInstallCommand: "npm i",
    workspace,
    files,
    target,
    workspacePackages,
    workspacePackagesString,
    command: devCommand,
    skip,
  });

  const dockerfileCommandsProd = generateDockerfileCommandsLayer({
    nodeEnvironment: "production",
    dependenciesInstallCommand: "npm ci --only=production",
    workspace,
    files,
    target,
    workspacePackages,
    workspacePackagesString,
    command: prodCommand,
    skip,
  });

  const completeDockerfileCommands =
    dockerfileCommandsBase.join(lineSeparator) +
    lineSeparator +
    dockerfileCommandsDev.filter((command) => command).join(lineSeparator) +
    lineSeparator +
    lineSeparator +
    dockerfileCommandsProd.filter((command) => command).join(lineSeparator);

  writeFileSync(
    `${projectAbsolutePath}/docker/Dockerfile.${container}`,
    completeDockerfileCommands
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
    files.length > 0
      ? files.map((file) => `${workingFolder}/${file}`).join(", ")
      : workingFolder;

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
};

const generateNonAppsDockerfiles = ({
  projectAbsolutePath,
  workspace,
  folderPath,
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
    const formattedDevCommand = startCommandDev.reduce(
      (str, current, index) => {
        const isLastIndex = index === startCommandDev.length - 1;
        return str + `\"${current}\"${!isLastIndex ? ", " : "]"}`;
      },
      "["
    );

    const formattedProdCommand = startCommandProd.reduce(
      (str, current, index) => {
        const isLastIndex = index === startCommandProd.length - 1;
        return str + `\"${current}\"${!isLastIndex ? ", " : "]"}`;
      },
      "["
    );

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
    });
  }
};
