import { readFileSync } from "fs";
import { getProjectAbsolutePath } from "@packages/paths";
import { DockerComposeData } from "@packages/docker";
import { convertYamlToObject } from "@packages/yaml";

export const detectPostgresContainersInRepo = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const dockerCompose = readFileSync(`${projectAbsolutePath}/docker-compose.yaml`, "utf-8");
  const convertedDockerCompose = convertYamlToObject({ str: dockerCompose }) as DockerComposeData;
  const { services } = convertedDockerCompose;

  const postgresqlServices: DockerComposeData["services"][number][] = [];
  for (const service in services) {
    const serviceData = services[service];
    if (service.includes("postgresql")) {
      postgresqlServices.push(serviceData);
    }
  }

  return postgresqlServices;
};
