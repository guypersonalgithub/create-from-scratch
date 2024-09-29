import { readdirSync, writeFileSync } from "fs";
import { detectUsedLocalPackages } from "@packages/packages";
import { DockerComposeData, Profiles, WorkspaceContainerProperties } from "./types";
import { getProjectAbsolutePath } from "@packages/paths";
import { getContainerProperties } from "./getContainerProperties";
import { generateNoneWorkspacePackageJsons } from "./generateNoneWorkspacePackageJsons";
import { convertObjectToYaml } from "@packages/yaml";

export const generateDockerComposeDev = () => {
  console.log("Generating new docker compose file");

  const dockerComposeData: DockerComposeData = {
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

  const remainingContainers = appWorkspaces({
    projectAbsolutePath,
    dockerComposeData,
    profiles,
  });

  nonWorkspaceContainers({
    nonWorkspaceContainers: remainingContainers,
    dockerComposeData,
    profiles,
  });

  const yamlFormat = convertObjectToYaml({ obj: dockerComposeData });
  writeFileSync(`${projectAbsolutePath}/docker-compose.yaml`, yamlFormat);
  writeFileSync(`${projectAbsolutePath}/profiles.json`, JSON.stringify([...profiles], null, 2));
};

type AppWorkspacesArgs = {
  projectAbsolutePath: string;
  dockerComposeData: DockerComposeData;
  profiles: Profiles;
};

const appWorkspaces = ({ projectAbsolutePath, dockerComposeData, profiles }: AppWorkspacesArgs) => {
  const folderPath = `${projectAbsolutePath}/apps`;

  const workspaces = readdirSync(folderPath);
  const remainingContainers: WorkspaceContainerProperties = {};

  workspaces.forEach((workspace: string) => {
    const workspacePackages = detectUsedLocalPackages({
      workspace: `apps/${workspace}`,
      projectAbsolutePath,
    });

    const workspaceContainerProperties = getContainerProperties({
      folderPath,
      workspace,
    });

    if (!workspaceContainerProperties) {
      console.error(`Skipping ${workspace} due to missing configurations.`);
      return;
    }

    generateNoneWorkspacePackageJsons({ folderPath, workspace });

    const { main, ...nonWorkspaceContainers } = workspaceContainerProperties;
    const { environment, volumes, networks, ports, dependsOn, restart = "unless-stopped" } = main;

    dockerComposeData.services[workspace] = {
      image: `${workspace}:latest`,
      environment: ["NODE_ENV=development", ...environment],
      build: {
        dockerfile: `./docker/Dockerfile.${workspace}`,
        context: "./",
        target: "development",
      },
      profiles: [workspace],
      // init: true,
      restart,
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
            source: `./${pack.path}`,
            target: `/usr/src/app/${pack.path}`,
          };
        }),
        ...volumes,
      ],
      networks,
      ports,
      depends_on: dependsOn,
    };

    profiles.add(workspace);

    for (const nonWorkspaceContainer in nonWorkspaceContainers) {
      const key = `${workspace}-${nonWorkspaceContainer}`;
      const data = nonWorkspaceContainers[nonWorkspaceContainer];
      remainingContainers[key] = data;
    }
  });

  return remainingContainers;
};

type NonWorkspaceContainersArgs = {
  nonWorkspaceContainers: WorkspaceContainerProperties;
  dockerComposeData: DockerComposeData;
  profiles: Profiles;
};

const nonWorkspaceContainers = ({
  nonWorkspaceContainers,
  dockerComposeData,
  profiles,
}: NonWorkspaceContainersArgs) => {
  const additionalProfiles: Record<string, Profiles> = {};

  for (const workspace in dockerComposeData.services) {
    const workspaceData = dockerComposeData.services[workspace];
    const { profiles, depends_on = [] } = workspaceData;

    depends_on.forEach((dependsOn) => {
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
    const {
      image,
      environment,
      volumes,
      networks,
      ports,
      dependsOn,
      dependencies = [],
      devDependencies = [],
      peerDependencies = [],
      restart = "unless-stopped",
    } = properties;

    const additionalProfilesForContainer = additionalProfiles[nonWorkspaceContainer] ?? [];

    // TODO: Avoid coupling dependencies and dockerfile creation for non-workspace containers.
    const hasADockerfile =
      dependencies.length > 0 || devDependencies.length > 0 || peerDependencies.length > 0;

    dockerComposeData.services[nonWorkspaceContainer] = {
      image: image ?? `${nonWorkspaceContainer}:latest`,
      build: hasADockerfile
        ? {
            dockerfile: `./docker/Dockerfile.${nonWorkspaceContainer}`,
            context: "./",
            target: "development",
          }
        : undefined,
      environment,
      profiles: [nonWorkspaceContainer, ...additionalProfilesForContainer],
      // init: true,
      restart,
      volumes,
      networks,
      ports,
      depends_on: dependsOn,
    };

    addDependencyProfile({
      dockerComposeData,
      dependsOn,
      containerKey: nonWorkspaceContainer,
    });

    profiles.add(nonWorkspaceContainer);
  }
};

type AddDependencyProfile = {
  dockerComposeData: DockerComposeData;
  dependsOn?: string[];
  containerKey: string;
};

const addDependencyProfile = ({
  dockerComposeData,
  dependsOn,
  containerKey,
}: AddDependencyProfile) => {
  if (!dependsOn) {
    return;
  }

  dependsOn.forEach((container) => {
    const dependencyContainer = dockerComposeData.services[container];
    const { depends_on } = dependencyContainer;
    dependencyContainer.profiles.push(containerKey);

    return addDependencyProfile({
      dockerComposeData,
      dependsOn: depends_on,
      containerKey,
    });
  });
};
