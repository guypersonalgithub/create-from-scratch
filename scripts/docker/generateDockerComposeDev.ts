import fs from "fs";
import jsYaml from "js-yaml";
import { detectPackages } from "../utils/detectPackages";
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
  containers({ projectAbsolutePath, dockerComposeData, profiles });

  const yamlFormat = jsYaml.dump(dockerComposeData);
  fs.writeFileSync(`${projectAbsolutePath}/docker-compose.yaml`, yamlFormat);
  fs.writeFileSync(
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

  const workspaces = fs.readdirSync(folderPath);

  workspaces.forEach((workspace: string) => {
    const workspacePackages = detectPackages({
      workspace: `apps/${workspace}`,
      projectAbsolutePath,
    });

    const workspaceContainerProperties = fs.readFileSync(
      `${folderPath}/${workspace}/containerProperties.json`,
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    const parsedProperties = JSON.parse(
      workspaceContainerProperties
    ) as workspaceContainerProperties;
    const { environment, volumes, networks, ports, dependsOn } =
      parsedProperties;

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
  });
};

type ContainersArgs = {
  projectAbsolutePath: string;
  dockerComposeData: dockerComposeData;
  profiles: Set<string>;
};

const containers = ({
  projectAbsolutePath,
  dockerComposeData,
  profiles,
}: ContainersArgs) => {
  const folderPath = `${projectAbsolutePath}/containers`;

  const nonWorkspaceContainers = fs.readdirSync(folderPath);

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

  nonWorkspaceContainers.forEach((nonWorkspaceContainer: string) => {
    const workspaceContainerProperties = fs.readFileSync(
      `${folderPath}/${nonWorkspaceContainer}/containerProperties.json`,
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    const parsedProperties = JSON.parse(
      workspaceContainerProperties
    ) as workspaceContainerProperties;

    const { image, environment, volumes, networks, ports } = parsedProperties;

    const additionalProfilesForContainer =
      additionalProfiles[nonWorkspaceContainer] ?? [];

    dockerComposeData.services[nonWorkspaceContainer] = {
      image,
      environment,
      profiles: [nonWorkspaceContainer, ...additionalProfilesForContainer],
      init: true,
      restart: "unless-stopped",
      volumes,
      networks,
      ports,
    };

    profiles.add(nonWorkspaceContainer);
  });
};
