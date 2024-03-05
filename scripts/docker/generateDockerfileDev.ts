import fs from "fs";
import { detectPackages } from "../utils/detectPackages";

const lineSeparator = "\n\n";

const generateDockerfileDev = () => {
  // Currently this script has both dev and prod commands, later on they will be separated into different files.
  console.log("Generating new Dockerfiles for each workspace");

  const workspaces = fs.readdirSync("../../apps");

  workspaces.forEach((workspace: string) => {
    const workspacePackages = detectPackages({
      workspace: `../../apps/${workspace}`,
    });

    const workspacePackagesString = workspacePackages
      .map((pack) => `./${pack}`)
      .join(" ");

    const dockerfileCommandsBase = [
      "FROM node:20.11.0-alpine3.19 AS base",
      "WORKDIR /usr/src/app",
      `COPY ./package-lock.json ./apps/${workspace}/package.json ./`,
    ];

    const dockerfileCommandsDev = [
      "FROM base as dev",
      "WORKDIR /usr/src/app",
      `RUN --mount=type=cache,target=/usr/src/app/.npm \\ \n    npm set cache /usr/src/app/.npm && \\ \n    npm i`,
      "USER node",
      `COPY --chown=node:node ./apps/${workspace} ./`,
      workspacePackages.length > 0
        ? `COPY --chown=node:node ${workspacePackagesString} ./packages/`
        : null,
      `CMD ["npm", "run", "dev"]`,
    ];

    const dockerfileCommandsProd = [
      "FROM base as production",
      "WORKDIR /usr/src/app",
      "ENV NODE_ENV production",
      `RUN --mount=type=cache,target=/usr/src/app/.npm \\ \n    npm set cache /usr/src/app/.npm && \\ \n    npm ci --only=production`,
      "USER node",
      `COPY --chown=node:node ./apps/${workspace} ./`,
      workspacePackages.length > 0
        ? `COPY --chown=node:node ${workspacePackagesString} ./packages/`
        : null,
      `CMD ["npm", "run", "build"]`,
    ];

    const completeDockerfileCommands =
      dockerfileCommandsBase.join(lineSeparator) +
      lineSeparator +
      dockerfileCommandsDev.filter((command) => command).join(lineSeparator) +
      lineSeparator +
      lineSeparator +
      dockerfileCommandsProd.filter((command) => command).join(lineSeparator);

    fs.writeFileSync(
      `../../docker/Dockerfile.${workspace}`,
      completeDockerfileCommands
    );
  });
};

generateDockerfileDev();
