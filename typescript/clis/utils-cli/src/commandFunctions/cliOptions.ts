import { generateDockerComposeDev, generateDockerfileDev } from "@packages/docker";
import { SupportedCommands } from "./supportedCommands";
import { printHelp } from "./printHelp";
import { runDockerContainers } from "./runDockerContainers";
import { generateAndInstallPackage } from "./generateAndInstallPackage";
import { generatePostgresTypes } from "./generatePostgresTypes";
import { updateViteConfigLocalDependenciesAliases } from "@packages/vite";
import { detectChangedDependencies } from "@packages/git";
import { type Flag, parseFlagArguments } from "@packages/utils";
import { generatePackageLock } from "@packages/package-lock";
import { generateGithubActionYaml } from "@packages/github-actions";
import { detectCircularDependencies, detectUndevelopedLocalPackages } from "@packages/packages";
import { setupPackage } from "@packages/setup-package";
import { createTypecheckConfigs } from "@packages/create-typecheck-github-actions-config";
import { getProjectAbsolutePath } from "@packages/paths";
import { generateAndInstallCLI } from "./generateAndInstallCLI";
import { getDependencyTrees } from "@packages/dependency-tree";
import { debugExtension } from "./debugExtension";

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
        folders: ["apps", "dev-apps", "test-apps"],
        localPackagesIdentifiers: ["packages", "dev-packages"],
        localPackagePrefix: "@",
      });
      break;
    }
    case SupportedCommands.PACKAGE_LOCK: {
      const forceUpdate = value.length > 0 ? value[0] === "force-update" : false;
      await generatePackageLock({
        workspacesFolders: ["apps", "dev-apps", "test-apps"],
        packagesFolders: ["packages", "dev-packages"],
        forceUpdate,
      });
      break;
    }
    case SupportedCommands.CHANGED_FILES: {
      const changedDependencies = await detectChangedDependencies();
      console.log(changedDependencies);
      break;
    }
    case SupportedCommands.GENERATE_GITHUB_ACTION_YAMLS: {
      generateGithubActionYaml({
        folders: ["apps", "packages", "dev-packages", "vscode-extensions"],
        uniqueFolders: ["cicd-configs"],
      });
      break;
    }
    case SupportedCommands.DETECT_CIRCULAR_DEPENDENCIES: {
      detectCircularDependencies({ mapProblematicPackageImports: true });
      break;
    }
    case SupportedCommands.SETUP_PACKAGE: {
      const {
        parsedArguments: { path, destination, bumpMajor, bumpMinor, bumpPatch },
      } = parseFlagArguments({ args: value });

      if (!path || !destination) {
        throw new Error("Missing package path!");
      }

      await setupPackage({
        path,
        destination,
        bumpMajor: !!bumpMajor,
        bumpMinor: !!bumpMinor,
        bumpPatch: !!bumpPatch,
      });
      break;
    }
    case SupportedCommands.DETECT_UNDEVELOPED_PACKAGES: {
      detectUndevelopedLocalPackages({});
      break;
    }
    case SupportedCommands.CREATE_TYPECHECK_GITHUB_ACTION_CONFIG_FILES: {
      createTypecheckConfigs({
        projectAbsolutePath: getProjectAbsolutePath(),
        folders: ["apps", "dev-apps", "test-apps", "packages", "dev-packages", "clis"],
      });
      break;
    }
    case SupportedCommands.CLI: {
      await generateAndInstallCLI({ value });
      break;
    }
    case SupportedCommands.DEPENDENCY_TREES: {
      getDependencyTrees();
      break;
    }
    case SupportedCommands.DEBUG_EXTENSION: {
      await debugExtension({ value });
      break;
    }
    default: {
      console.error(`Skipping an encountered unsupported command - ${key}.`);
    }
  }
};
