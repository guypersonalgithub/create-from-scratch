import { readFileSync } from "fs";
import { getProjectAbsolutePath } from "../paths";
import jsYaml from "js-yaml";
import { DockerComposeData } from "../docker";

export const detectPostgresContainersInRepo = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const dockerCompose = readFileSync(
    `${projectAbsolutePath}/docker-compose.yaml`,
    "utf-8"
  );
  const convertedDockerCompose = jsYaml.load(
    dockerCompose
  ) as DockerComposeData;
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
