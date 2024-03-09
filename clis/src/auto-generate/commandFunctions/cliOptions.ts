import {
  Command,
  generateDockerComposeDev,
  generateDockerfileDev,
  generatePackage,
} from "utility-scripts";

type CliOptionsArgs = {
  command: Command;
};

export const cliOptions = ({ command }: CliOptionsArgs) => {
  const { key, value } = command;

  switch (key) {
    case "--help": {
      console.log(`
Common commands:
    docker-compose-dev - Generates the docker compose file with the current package.json properties of each workspace and local packages it uses for the dev environment.
    dockerfile - Generates different docker files for each and every workspace and local packages it uses.
    package [name] - Generates [name] package with a default predefined package template.`);
      break;
    }
    case "--docker-compose-dev": {
      generateDockerComposeDev();
      break;
    }
    case "--dockerfile": {
      generateDockerfileDev();
      break;
    }
    case "--package": {
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
    default: {
      console.error(`Skipping an encountered unsupported command - ${key}.`);
    }
  }
};
