// TODO: Move to a dedicated new CLI.

import {
  findAvailablePortsInRange,
  // getOpenBrowserTabCommand,
  runSequencedCommands,
  // RunSequencedCommandsArgs,
} from "../dev-tools";

const runDependensee = async () => {
  const basePort = 10000;
  const amountOfPorts = 2;
  const response = await findAvailablePortsInRange({
    startPort: basePort,
    endPort: basePort + 1000,
    amountOfPorts,
  });

  if (response.length < amountOfPorts) {
    throw new Error("Not enough ports are available within the given range!");
  }

  const [frontendPortNumber, backendPortNumber] = response;

  await runSequencedCommands({
    commands: [
      {
        command: "npm",
        args: [
          "run",
          "workspace",
          "--",
          "--workspace=package-manager-backend",
          `--port=${backendPortNumber}`,
          `--front_port=${frontendPortNumber}`,
          "--skipPort",
          "--setEnvVariables",
        ],
        readinessCheckString: "Listening",
        // updateArgsBasedOffPreviousCommandLogs: ({ args, logs }) => {
        //   const commandRow = logs.find((log) => log.includes("vite --host"));
        //   const portRegex = /--port=(\d+)/;
        //   const match = commandRow?.match(portRegex);
        //   const frontendPort = match?.[1];
        //   if (frontendPort) {
        //     frontendPortNumber = Number(frontendPort);
        //     args.push(`--front_port=${frontendPort}`);
        //   }

        //   return args;
        // },
      },
      {
        command: "npm",
        args: [
          "run",
          "workspace",
          "--",
          "--workspace=package-manager",
          `--port=${frontendPortNumber}`,
          `--back_port=${backendPortNumber}`,
          "--skipPort",
          "--setEnvVariables",
          "--envPrefix=VITE",
          "--skipEnvPort",
          // "--skipTab",
        ],
        readinessCheckString: "ready",
        // withLogs: true,
      },
    ],
    exitOnFailure: true,
  });

  // if (!frontendPortNumber) {
  //   return;
  // }

  // const additionalCommands: RunSequencedCommandsArgs["commands"] = [];

  // const command = getOpenBrowserTabCommand({
  //   url: `http://localhost:${frontendPortNumber}`,
  // });
  // const splitCommand = command.split(" ");
  // additionalCommands.push({
  //   command: splitCommand[0],
  //   args: splitCommand.slice(1),
  //   processName: "Open browser",
  // });

  // await runSequencedCommands({
  //   commands: additionalCommands,
  // });
};

runDependensee();
