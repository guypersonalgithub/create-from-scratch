import {
  Command,
  detectAllRepositoryDependencies,
  detectPackage,
  detectPostgresContainersInRepo,
  executeTerminalCommand,
  generateDockerComposeDev,
  generateDockerfileDev,
  generatePackage,
  generatePostgresDBTypes,
  insertPackageTypes,
  parseEnvironmentString,
  requestUserInput,
  runDockerContainersByProfile,
} from "utility-scripts";
import { supportedCommands } from "./supportedCommands";
import { loadEnvVariables } from "utility-scripts/utils/envVariables";
import { printHelp } from "./printHelp";

type CliOptionsArgs = {
  command: Command;
};

export const cliOptions = async ({ command }: CliOptionsArgs) => {
  const { key, value } = command;

  switch (key) {
    case `--${supportedCommands.help}`: {
      printHelp();
      break;
    }
    case `--${supportedCommands["docker-compose-dev"]}`: {
      generateDockerComposeDev();
      break;
    }
    case `--${supportedCommands.dockerfile}`: {
      generateDockerfileDev();
      break;
    }
    case `--${supportedCommands.package}`: {
      if (value.length === 0) {
        console.error("Missing package name!");
        return;
      }
      if (value.length > 1) {
        console.error(
          "Received a package name with space, which is not a format npm supports."
        );
        return;
      }

      const name = value[0];
      generatePackage({ packageName: name });
      await executeTerminalCommand({ command: "npm i" });
      break;
    }
    case `--${supportedCommands.container}`: {
      if (value.length === 0) {
        console.error("Missing profiles!");
      }

      await runDockerContainersByProfile({ profiles: value });
      break;
    }
    case `--${supportedCommands["generate-postgres-types"]}`: {
      const services = detectPostgresContainersInRepo();
      loadEnvVariables();

      const commonPostgresVariables = [
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_DB",
      ];

      for await (const service of services) {
        const { profiles, ports, environment } = service;
        const mainProfile = profiles?.[0];
        const portString = ports?.[0]?.split(":")?.[0];
        if (!portString) {
          console.error(`Missing port, skipping ${mainProfile}`);
          continue;
        }

        const host = "localhost";
        const port = Number(portString);
        const [user, password, database] = environment.map((env, index) => {
          const postgresVariable = commonPostgresVariables[index];
          const variableString = environment.find((env) =>
            env.includes(postgresVariable)
          );
          if (!variableString) {
            return;
          }

          return parseEnvironmentString({ environmentString: variableString });
        });
        if (!user || !password || !database) {
          console.error(
            `Missing crucial env variable, skipping ${mainProfile}`
          );
          continue;
        }

        const packageName = `${mainProfile}-types`;
        const dbTypes = await generatePostgresDBTypes({
          profile: mainProfile,
          host,
          port,
          user,
          password,
          database,
        });
        if (dbTypes.length === 0) {
          return;
        }
        detectPackage({ packageName });
        insertPackageTypes({ packageName, dbTypes });
      }

      break;
    }
    case `--${supportedCommands["get-dependencies"]}`: {
      const dependencies = detectAllRepositoryDependencies();
      console.log(dependencies);

      const action = await requestUserInput({
        question: "Would you like to update a package, or do nothing?",
      });

      if (action === "do nothing" || action !== "update a package") {
        return;
      }

      const allPackagesAvailable = Object.keys(dependencies);

      const response = await requestUserInput({
        question: `Please pick a package from the following list:\r\n ${allPackagesAvailable.join(
          ",\r\n"
        )}`,
      });

      if (!allPackagesAvailable.includes(response)) {
        console.error("An incorrect package name was typed.");
        return;
      }

      const packageOptions = dependencies[response];
      console.log(packageOptions);
      console.log("Under development, updating packages will be added soon.");
      break;
    }
    default: {
      console.error(`Skipping an encountered unsupported command - ${key}.`);
    }
  }
};
