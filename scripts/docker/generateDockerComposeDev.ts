import fs from "fs";
import jsYaml from "js-yaml";
import { detectPackages } from "../utils/detectPackages";
import { dockerComposeData, workspaceContainerProperties } from "./types";

const generateDockerComposeDev = () => {
  console.log("Generating new docker compose file");

  const dockerComposeData: dockerComposeData = {
    services: {},
    networks: {
      frontend: {
        name: "frontend",
      },
      backend: {
        name: "backend",
      },
    },
  };

  const workspaces = fs.readdirSync("../../apps");

  workspaces.forEach((workspace: string) => {
    const workspacePackages = detectPackages({
      workspace: `../../apps/${workspace}`,
    });

    const workspaceContainerProperties = fs.readFileSync(
      `../../apps/${workspace}/containerProperties.json`,
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    const parsedProperties = JSON.parse(
      workspaceContainerProperties
    ) as workspaceContainerProperties;
    const { environment, volumes, networks, ports } = parsedProperties;

    dockerComposeData.services[workspace] = {
      image: `${workspace}:latest`,
      environment: ["NODE_ENV=development", ...environment],
      build: {
        dockerfile: `./docker/Dockerfile.${workspace}`,
        context: "./",
        target: "dev",
      },
      init: true,
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
    };
  });

  const yamlFormat = jsYaml.dump(dockerComposeData);
  fs.writeFileSync("../../docker-compose.yaml", yamlFormat);
};

generateDockerComposeDev();
