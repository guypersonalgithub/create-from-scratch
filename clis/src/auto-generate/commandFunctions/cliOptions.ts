import {
  Command,
  detectPackage,
  detectPostgresContainersInRepo,
  generateDockerComposeDev,
  generateDockerfileDev,
  generatePackage,
  generatePostgresDBTypes,
  getAvailableDockerProfiles,
  insertPackageTypes,
  parseEnvironmentString,
  runDockerContainersByProfile,
} from "utility-scripts";
import { supportedCommands } from "./supportedCommands";
import { loadEnvVariables } from "utility-scripts/utils/envVariables";

type CliOptionsArgs = {
  command: Command;
};

export const cliOptions = async ({ command }: CliOptionsArgs) => {
  const { key, value } = command;

  switch (key) {
    case `--${supportedCommands.help}`: {
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
    } - Generates an appropriate types package and file with the tables' columns' types.`);
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
    default: {
      console.error(`Skipping an encountered unsupported command - ${key}.`);
    }
  }
};
