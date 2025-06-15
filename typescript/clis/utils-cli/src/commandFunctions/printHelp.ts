import { getAvailableDockerProfiles } from "@packages/docker";
import { SupportedCommands } from "./supportedCommands";

export const printHelp = () => {
  const profiles = getAvailableDockerProfiles();

  console.log("Commands:");

  const commandDescriptions: Record<
    (typeof SupportedCommands)[keyof Omit<typeof SupportedCommands, "HELP">],
    string
  > = {
    [SupportedCommands.DOCKER_COMPOSE_DEV]:
      "Generates the docker compose file with the current package.json properties of each workspace and local packages it uses for the dev environment.",
    [SupportedCommands.DOCKERFILE]:
      "Generates different docker files for each and every workspace and local packages it uses.",
    [SupportedCommands.PACKAGE]:
      "[name] - Generates [name] package with a default predefined package template.",
    [SupportedCommands.CONTAINER]: `[profiles] - Will build images, volumes and containers for the appropriate docker profiles. Available options - ${profiles.join(
      ", ",
    )}`,
    [SupportedCommands.GENERATE_POSTGRES_TYPES]:
      "Generates an appropriate types package and file with the tables' columns' types.",
    [SupportedCommands.VITE_ALIASES]:
      "Updates for each workspace based off Vite its resolve aliases of local dependencies within its vite config file",
    [SupportedCommands.PACKAGE_LOCK]:
      "Generates different package-lock.json files for each workspace",
    [SupportedCommands.CHANGED_FILES]: "Lists all of the files that were changed in the repository",
    [SupportedCommands.GENERATE_GITHUB_ACTION_YAMLS]:
      "Generates github action yamls to workspaces if they contain appropriate github cicd config files",
    [SupportedCommands.DETECT_CIRCULAR_DEPENDENCIES]:
      "Detects circular dependencies for local packages",
    [SupportedCommands.SETUP_PACKAGE]: "Setups packages for NPM publishments",
    [SupportedCommands.DETECT_UNDEVELOPED_PACKAGES]:
      "Detects local packages that were created but not developed afterwards",
    [SupportedCommands.CREATE_TYPECHECK_GITHUB_ACTION_CONFIG_FILES]:
      "Creates typecheck github action config files",
  };

  for (const command in commandDescriptions) {
    const description = commandDescriptions[command as keyof typeof commandDescriptions];

    console.log(`${command} - ${description}`);
  }
};
