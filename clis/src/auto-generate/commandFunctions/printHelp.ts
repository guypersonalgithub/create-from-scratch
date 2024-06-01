import { getAvailableDockerProfiles } from "utility-scripts";
import { SupportedCommands } from "./supportedCommands";
import { FilterEnums } from "@packages/utils";

export const printHelp = () => {
  const profiles = getAvailableDockerProfiles();

  console.log("Commands:");

  const commandDescriptions: Record<
    FilterEnums<SupportedCommands, SupportedCommands.HELP>,
    string
  > = {
    [SupportedCommands.DOCKER_COMPOSE_DEV]:
      "Generates the docker compose file with the current package.json properties of each workspace and local packages it uses for the dev environment.",
    [SupportedCommands.DOCKERFILE]:
      "Generates different docker files for each and every workspace and local packages it uses.",
    [SupportedCommands.PACKAGE]:
      "[name] - Generates [name] package with a default predefined package template.",
    [SupportedCommands.CONTAINER]: `[profiles] - Will build images, volumes and containers for the appropriate docker profiles. Available options - ${profiles.join(
      ", "
    )}`,
    [SupportedCommands.GENERATE_POSTGRES_TYPES]:
      "Generates an appropriate types package and file with the tables' columns' types.",
    [SupportedCommands.GET_DEPENDENCIES]:
      "Generates a list with all dependencies in any package.json in the repository and other json files, based off the configuration file",
    [SupportedCommands.VITE_ALIASES]:
      "Updates for each workspace based off Vite its resolve aliases of local dependencies within its vite config file",
  };

  for (const command in commandDescriptions) {
    const description =
      commandDescriptions[command as keyof typeof commandDescriptions];

    console.log(`${command} - ${description}`);
  }
};
