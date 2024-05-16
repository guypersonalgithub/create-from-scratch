import {
  detectPackage,
  detectPostgresContainersInRepo,
  generatePostgresDBTypes,
  insertPackageTypes,
  parseEnvironmentString,
} from "utility-scripts";
import { loadEnvVariables } from "utility-scripts/utils/envVariables";

export const generatePostgresTypes = async () => {
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
    const [user, password, database] = environment.map((_, index) => {
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
      console.error(`Missing crucial env variable, skipping ${mainProfile}`);
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
};
