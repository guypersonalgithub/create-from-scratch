import { executeTerminalCommand } from "../terminal";
import { getAvailableDockerProfiles } from "./getAvailableDockerProfiles";

type RunDockerContainersByProfileArgs = {
  profiles: string[];
};

export const runDockerContainersByProfile = async ({
  profiles,
}: RunDockerContainersByProfileArgs) => {
  const existingProfiles = getAvailableDockerProfiles();
  const profilesSet = new Set<string>([...existingProfiles]);
  const initialCommand = "docker compose";

  const command = profiles.reduce((command, current) => {
    const profileSupported = profilesSet.has(current);
    if (!profileSupported) {
      console.error(`Skipping an encountered unsupported profile - ${current}`);
      return command;
    }

    return `${command} --profile ${current}`;
  }, initialCommand);

  if (command === initialCommand) {
    console.error(
      "None of the received profiles was supported, cancelling the request."
    );
    return;
  }

  const completeCommand = `${command} up -d --build`;

  await executeTerminalCommand({ command: completeCommand });
};
