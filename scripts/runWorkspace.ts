import { readdirSync } from "fs";
import {
  detectPackageEnvironment,
  ExecuteTerminalCommandWithReadinessCheckArgs,
  findAvailablePortInRange,
  getFlags,
  getOpenBrowserTabCommand,
  getOperatingSystem,
  getProjectAbsolutePath,
  runSequencedCommands,
} from "../devTools";
import { sep } from "path";

const runWorkspace = async () => {
  const flags = getFlags();
  const workspace = flags.find((flag) => flag.key === "workspace");
  const port = flags.find((flag) => flag.key === "port");
  const skipPort = flags.find((flag) => flag.key === "skipPort");

  if (!workspace) {
    throw "Missing workspace flag!";
  }

  if (!port) {
    throw "Missing port flag!";
  }

  const workspaceFolders = ["apps", "devApps"];
  const projectAbsolutePath = getProjectAbsolutePath();
  const separator = sep;

  const workspacePaths: Record<string, string> = {};

  workspaceFolders.forEach((folder) => {
    const folderPath = `${projectAbsolutePath}${separator}${folder}`;
    const workspaces = readdirSync(folderPath);

    workspaces.forEach((workspace) => {
      const identifier = workspace;
      const fullPath = `${folderPath}${separator}${workspace}`;
      workspacePaths[identifier] = fullPath;
    });
  });

  const path = workspacePaths[workspace.value?.[0]];

  if (!path) {
    throw `Given workspace isn't supported.`;
  }

  const portNumber = Number(port?.value?.[0]);
  const operatingSystem = getOperatingSystem();
  let response: number | null = portNumber;
  if (!skipPort) {
    response = await findAvailablePortInRange({
      startPort: portNumber,
      endPort: portNumber + 1000,
      operatingSystem,
    });

    if (!response) {
      throw "Failed to find an available port within range.";
    }
  }

  const environment = detectPackageEnvironment({ path: `${path}/package.json` });

  const commands: Omit<
    ExecuteTerminalCommandWithReadinessCheckArgs,
    "exitOnFailure" | "readinessCheck"
  >[] = [
    {
      command: `cd ${path} && npm`,
      args: ["run", "dev", "--", `--port=${response}`],
      processName: "Run workspace",
      readinessCheckString: environment === "frontend" ? "ready" : "Listening",
    },
  ];

  if (environment === "frontend") {
    const command = getOpenBrowserTabCommand({
      url: `http://localhost:${response}`,
      operatingSystem,
    });
    const splitCommand = command.split(" ");
    commands.push({
      command: splitCommand[0],
      args: splitCommand.slice(1),
      processName: "Open browser",
    });
  }
  await runSequencedCommands({ commands, exitOnFailure: true });
};

runWorkspace();
