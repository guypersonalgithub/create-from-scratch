import {
  Command,
  detectChangedDependencies,
  generateDockerComposeDev,
  generateDockerfileDev,
  generatePackageLock,
  updateViteConfigLocalDependenciesAliases,
} from "dev-tools";
import { SupportedCommands } from "./supportedCommands";
import { printHelp } from "./printHelp";
import { runDockerContainers } from "./runDockerContainers";
import { generateAndInstallPackage } from "./generateAndInstallPackage";
import { generatePostgresTypes } from "./generatePostgresTypes";
import { pickDependenciesToUpdate } from "./pickDependenciesToUpdate";

type CliOptionsArgs = {
  command: Command;
};

export const cliOptions = async ({ command }: CliOptionsArgs) => {
  const { key, value } = command;

  switch (key) {
    case SupportedCommands.HELP: {
      printHelp();
      break;
    }
    case SupportedCommands.DOCKER_COMPOSE_DEV: {
      generateDockerComposeDev();
      break;
    }
    case SupportedCommands.DOCKERFILE: {
      generateDockerfileDev();
      break;
    }
    case SupportedCommands.PACKAGE: {
      await generateAndInstallPackage({ value });
      break;
    }
    case SupportedCommands.CONTAINER: {
      await runDockerContainers({ pickedContainers: value });
      break;
    }
    case SupportedCommands.GENERATE_POSTGRES_TYPES: {
      await generatePostgresTypes();
      break;
    }
    case SupportedCommands.GET_DEPENDENCIES: {
      await pickDependenciesToUpdate();
      break;
    }
    case SupportedCommands.VITE_ALIASES: {
      await updateViteConfigLocalDependenciesAliases({ folders: ["apps", "devApps"] });
      break;
    }
    case SupportedCommands.PACKAGE_LOCK: {
      await generatePackageLock();
      break;
    }
    case SupportedCommands.CHANGED_FILES: {
      const changedDependencies = await detectChangedDependencies();
      console.log(changedDependencies);
      break;
    }
    default: {
      console.error(`Skipping an encountered unsupported command - ${key}.`);
    }
  }
};
