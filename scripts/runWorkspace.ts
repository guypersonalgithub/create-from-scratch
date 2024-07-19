import { readdirSync } from "fs";
import {
  detectPackageEnvironment,
  executeTerminalCommand,
  findAvailablePortInRange,
  getCommandFlags,
  getOperatingSystem,
  getProjectAbsolutePath,
  openBrowserTab,
} from "../devTools";
import { sep } from "path";

const runWorkspace = async () => {
  const commands = getCommandFlags();
  const workspace = commands.find((command) => command.key === "workspace");
  const port = commands.find((command) => command.key === "port");

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
  const response = await findAvailablePortInRange({
    startPort: portNumber,
    endPort: portNumber + 1000,
    operatingSystem,
  });

  if (!response) {
    throw "Failed to find an available port within range.";
  }

  const environment = detectPackageEnvironment({ path: `${path}/package.json` });

  if (environment === "frontend") {
    openBrowserTab({ url: `http://localhost:${response}`, operatingSystem });
  }

  const command = `cd ${path} && npm run dev -- --port=${response}`;
  await executeTerminalCommand({ command });
};

runWorkspace();
