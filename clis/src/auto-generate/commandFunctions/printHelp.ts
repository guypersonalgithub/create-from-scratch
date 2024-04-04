import { getAvailableDockerProfiles } from "utility-scripts";
import { supportedCommands } from "./supportedCommands";

export const printHelp = () => {
  const profiles = getAvailableDockerProfiles();

  console.log(`
Common commands:
    ${
      supportedCommands["docker-compose-dev"]
    } - Generates the docker compose file with the current package.json properties of each workspace and local packages it uses for the dev environment.
    ${
      supportedCommands.dockerfile
    } - Generates different docker files for each and every workspace and local packages it uses.
    ${
      supportedCommands.package
    } [name] - Generates [name] package with a default predefined package template.
    ${
      supportedCommands.container
    } [profiles] - Will build images, volumes and containers for the appropriate docker profiles. Available options - ${profiles.join(
    ", "
  )}
    ${
      supportedCommands["generate-postgres-types"]
    } - Generates an appropriate types package and file with the tables' columns' types.
    ${
      supportedCommands["get-dependencies"]
    } - Generates a list with all dependencies in any package.json in the repository and other json files, based off the configuration file`);
};
