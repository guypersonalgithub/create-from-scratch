import { readdirSync } from "fs";
import { sep } from "path";
import { convertFlagsArrayToObject } from "../packages/utils/src/flags";
import { getOperatingSystem } from "@packages/os";
import { detectPackageEnvironment } from "@packages/dev-utils";
import { ExecuteTerminalCommandWithReadinessCheckArgs } from "@packages/terminal-utils";
import { getOpenBrowserTabCommand } from "@packages/dev-utils";
import { findAvailablePortsInRange } from "@packages/ports";
import { runSequencedCommands } from "@packages/terminal-multi-commands";
import { getProjectAbsolutePath } from "@packages/paths";
import { getFlags } from "@packages/utils";

const runWorkspace = async () => {
  const flags = getFlags();
  const flagsObject = convertFlagsArrayToObject({ flags });
  const { workspace, port, skipPort, skipTab, setEnvVariables, envPrefix, skipEnvPort, ...rest } =
    flagsObject;

  if (!workspace) {
    throw "Missing workspace flag!";
  }

  if (!port) {
    throw "Missing port flag!";
  }

  const workspaceFolders = ["apps", "dev-apps"];
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

  const path = workspacePaths[workspace];

  if (!path) {
    throw `Given workspace isn't supported.`;
  }

  const portNumber = Number(port);
  const operatingSystem = getOperatingSystem();
  let availablePort: number | null = portNumber;
  if (skipPort === undefined) {
    const response = await findAvailablePortsInRange({
      startPort: portNumber,
      endPort: portNumber + 1000,
      operatingSystem,
    });

    if (response.length === 0) {
      throw "Failed to find an available port within range.";
    }

    availablePort = response?.[0];
  }

  const environment = detectPackageEnvironment({ path: `${path}/package.json` });

  const firstCommand = {
    command: `cd ${path} && npm`,
    args: ["run", "dev", "--", `--port=${availablePort}`],
    processName: workspace,
    readinessCheckString: environment === "frontend" ? "ready" : "Listening",
  };

  if (setEnvVariables !== undefined) {
    const envVariables = { ...(skipEnvPort === undefined ? { port } : {}), ...rest };

    for (const key in envVariables) {
      const envKey = key.toUpperCase();
      const value = envVariables[key];
      const fullKey = envPrefix ? `${envPrefix}_${envKey}` : envKey;
      process.env[fullKey] = value;
    }
  }

  if (rest && setEnvVariables === undefined) {
    const additionalFlags: string[] = [];
    for (const property in rest) {
      const value = rest[property];
      additionalFlags.push(`--${property}=${value}`);
    }

    firstCommand.args.push(...additionalFlags);
  }

  const commands: Omit<
    ExecuteTerminalCommandWithReadinessCheckArgs,
    "exitOnFailure" | "readinessCheck"
  >[] = [firstCommand];

  if (environment === "frontend" && skipTab === undefined) {
    const command = getOpenBrowserTabCommand({
      url: `http://localhost:${availablePort}`,
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
