import { generateDockerComposeDev, generateDockerfileDev } from "@packages/docker";
import { SupportedCommands } from "./supportedCommands";
import { printHelp } from "./printHelp";
import { runDockerContainers } from "./runDockerContainers";
import { generateAndInstallPackage } from "./generateAndInstallPackage";
import { generatePostgresTypes } from "./generatePostgresTypes";
import { updateViteConfigLocalDependenciesAliases } from "@packages/vite";
import { detectChangedDependencies } from "@packages/git";
import { Flag } from "@packages/utils";
import { generatePackageLock } from "@packages/package-lock";
import { generateGithubActionYaml } from "@packages/github-actions";

type CliOptionsArgs = {
  command: Flag;
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
    case SupportedCommands.VITE_ALIASES: {
      await updateViteConfigLocalDependenciesAliases({
        folders: ["apps", "dev-apps"],
        localPackagesIdentifiers: ["packages", "dev-packages"],
      });
      break;
    }
    case SupportedCommands.PACKAGE_LOCK: {
      await generatePackageLock({ value });
      break;
    }
    case SupportedCommands.CHANGED_FILES: {
      const changedDependencies = await detectChangedDependencies();
      console.log(changedDependencies);
      break;
    }
    case SupportedCommands.GENERATE_GITHUB_ACTION_YAMLS: {
      await generateGithubActionYaml();
      break;
    }
    default: {
      console.error(`Skipping an encountered unsupported command - ${key}.`);
    }
  }
};
