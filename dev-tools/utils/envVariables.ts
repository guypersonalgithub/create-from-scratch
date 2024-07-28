import { readFileSync } from "fs";
import { getProjectAbsolutePath } from "@packages/paths";

export const loadEnvVariables = () => {
  const absolutePath = getProjectAbsolutePath();
  const envVariables = readFileSync(`${absolutePath}/.env`, {
    encoding: "utf-8",
  });
  const variables = envVariables.split("\r\n");
  variables.forEach((variable) => {
    const [key, value] = variable.split("=");
    if (process.env[key]) {
      return;
    }

    process.env[key] = value.slice(1, value.length - 1);
  });
};
