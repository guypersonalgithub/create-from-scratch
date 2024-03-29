import { readFileSync, readdirSync, writeFileSync } from "fs";
import jsYaml from "js-yaml";
import { detectWorkspacePackages } from "../packages/detectWorkspacePackages";
import { dockerComposeData, workspaceContainerProperties } from "./types";
import { getProjectAbsolutePath } from "../utils";

export const generateDockerComposeDev = () => {
  console.log("Generating new docker compose file");

  const dockerComposeData: dockerComposeData = {
    services: {},
    volumes: {
      pgdata: {
        external: false,
      },
    },
    networks: {
      frontend: {
        name: "frontend",
      },
      backend: {
        name: "backend",
      },
    },
  };

  const profiles = new Set<string>();

  const projectAbsolutePath = getProjectAbsolutePath();

  appWorkspaces({ projectAbsolutePath, dockerComposeData, profiles });

  const yamlFormat = jsYaml.dump(dockerComposeData);
  writeFileSync(`${projectAbsolutePath}/docker-compose.yaml`, yamlFormat);
  writeFileSync(
    `${projectAbsolutePath}/profiles.json`,
    JSON.stringify([...profiles], null, 2)
  );
};

type AppWorkspacesArgs = {
  projectAbsolutePath: string;
  dockerComposeData: dockerComposeData;
  profiles: Set<string>;
};

const appWorkspaces = ({
  projectAbsolutePath,
  dockerComposeData,
  profiles,
}: AppWorkspacesArgs) => {
  const folderPath = `${projectAbsolutePath}/apps`;

  const workspaces = readdirSync(folderPath);

  workspaces.forEach((workspace: string) => {
    const workspacePackages = detectWorkspacePackages({
      workspace: `apps/${workspace}`,
      projectAbsolutePath,
    });

    const workspaceContainerProperties = readFileSync(
      `${folderPath}/${workspace}/containerProperties.json`,
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    const parsedProperties = JSON.parse(
      workspaceContainerProperties
    ) as workspaceContainerProperties;
    const { main, ...others } = parsedProperties;
    const { environment, volumes, networks, ports, dependsOn } = main;

    dockerComposeData.services[workspace] = {
      image: `${workspace}:latest`,
      environment: ["NODE_ENV=development", ...environment],
      build: {
        dockerfile: `./docker/Dockerfile.${workspace}`,
        context: "./",
        target: "dev",
      },
      profiles: [workspace],
      init: true,
      restart: "unless-stopped",
      volumes: [
        {
          type: "bind",
          source: `./apps/${workspace}/`,
          target: "/usr/src/app/",
        },
        {
          type: "volume",
          target: "/usr/src/app/node_modules",
        },
        ...workspacePackages.map((pack) => {
          return {
            type: "bind",
            source: `./${pack}`,
            target: `/usr/src/app/${pack}`,
          };
        }),
        ...volumes,
      ],
      networks,
      ports,
      depends_on: dependsOn,
    };

    profiles.add(workspace);

    nonWorkspaceContainers({
      workspace,
      nonWorkspaceContainers: others,
      dockerComposeData,
      profiles,
    });
  });
};

type NonWorkspaceContainersArgs = {
  workspace: string;
  nonWorkspaceContainers: workspaceContainerProperties;
  dockerComposeData: dockerComposeData;
  profiles: Set<string>;
};

const nonWorkspaceContainers = ({
  workspace,
  nonWorkspaceContainers,
  dockerComposeData,
  profiles,
}: NonWorkspaceContainersArgs) => {
  const additionalProfiles: Record<string, Set<string>> = {};

  for (const workspace in dockerComposeData.services) {
    const workspaceData = dockerComposeData.services[workspace];
    const { profiles, depends_on } = workspaceData;

    depends_on?.forEach((dependsOn) => {
      if (!additionalProfiles[dependsOn]) {
        additionalProfiles[dependsOn] = new Set();
      }

      profiles.forEach((profile) => {
        additionalProfiles[dependsOn].add(profile);
      });
    });
  }

  for (const nonWorkspaceContainer in nonWorkspaceContainers) {
    const properties = nonWorkspaceContainers[nonWorkspaceContainer];
    const { image, environment, volumes, networks, ports } = properties;
    const key = `${workspace}-${nonWorkspaceContainer}`;
    const additionalProfilesForContainer = additionalProfiles[key] ?? [];

    dockerComposeData.services[key] = {
      image,
      environment,
      profiles: [key, ...additionalProfilesForContainer],
      init: true,
      restart: "unless-stopped",
      volumes,
      networks,
      ports,
    };

    profiles.add(key);
  }
};
