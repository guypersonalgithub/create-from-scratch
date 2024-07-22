// TODO: Move to a dedicated new CLI.

import { runSequencedCommands } from "../devTools";

const runDependensee = async () => {
  await runSequencedCommands({
    commands: [
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
      },
      {
        command: "npm",
        args: [
          "run",
          "workspace",
          "--",
          "--workspace=package-manager",
          "--port=10000",
          "--skipPort",
        ],
        readinessCheckString: "ready",
      },
    ],
    exitOnFailure: true,
  });
};

runDependensee();
