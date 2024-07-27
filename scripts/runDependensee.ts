// TODO: Move to a dedicated new CLI.

import {
  getOpenBrowserTabCommand,
  runSequencedCommands,
  RunSequencedCommandsArgs,
} from "../devTools";

const runDependensee = async () => {
  let frontendPortNumber: number | undefined;

  await runSequencedCommands({
    commands: [
      {
        command: "npm",
        args: [
          "run",
          "workspace",
          "--",
          "--workspace=package-manager",
          "--port=10000",
          "--skipPort",
          "--skipTab",
        ],
        readinessCheckString: "ready",
        withLogs: true,
      },
      {
        command: "npm",
        args: [
          "run",
          "workspace",
          "--",
          "--workspace=package-manager-backend",
          "--port=10001",
          "--skipPort",
        ],
        readinessCheckString: "Listening",
        updateArgsBasedOffPreviousCommandLogs: ({ args, logs }) => {
          const commandRow = logs.find((log) => log.includes("vite --host"));
          const portRegex = /--port=(\d+)/;
          const match = commandRow?.match(portRegex);
          const frontendPort = match?.[1];
          if (frontendPort) {
            frontendPortNumber = Number(frontendPort);
            args.push(`--front_port=${frontendPort}`);
          }

          return args;
        },
      },
    ],
    exitOnFailure: true,
  });

  if (!frontendPortNumber) {
    return;
  }

  const additionalCommands: RunSequencedCommandsArgs["commands"] = [];

  const command = getOpenBrowserTabCommand({
    url: `http://localhost:${frontendPortNumber}`,
  });
  const splitCommand = command.split(" ");
  additionalCommands.push({
    command: splitCommand[0],
    args: splitCommand.slice(1),
    processName: "Open browser",
  });

  await runSequencedCommands({
    commands: additionalCommands,
  });
};

runDependensee();
