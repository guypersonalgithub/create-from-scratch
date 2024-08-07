import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { getProjectAbsolutePath } from "@packages/paths";
import { detectUsedLocalPackages } from "../packages";
import { executeTerminalCommand, multiOptions } from "../terminal";
import { detectPackageJsonDependencyChanges, updateGitIgnore } from "../git";
import { getPackageManagerCreateLockfileOnlyCommand } from "@packages/package-manager";

type GeneratePackageLockArgs = {
  value: string[];
};

export const generatePackageLock = async ({ value }: GeneratePackageLockArgs) => {
  let forceUpdate = value.length > 0 ? value[0] === "force-update" : false;

  if (value.length === 0) {
    const selectedOptions = await multiOptions({
      options: [
        {
          value: "forceUpdate",
          label: "Force update",
        },
        {
          value: "skipForceUpdate",
          label: "Skip force update",
        },
      ],
      prefixText: "Please pick the option you'd like to use:\n",
      suffixText: "\nPress Enter to confirm",
    });

    const pickedOption = selectedOptions[0];
    forceUpdate = pickedOption.value === "forceUpdate";
  }

  const projectAbsolutePath = getProjectAbsolutePath();
  const workspacesFolder = "apps";
  const packagesFolder = "packages";
  const temporaryFolder = "temp";
  const folderPath = `${projectAbsolutePath}/${workspacesFolder}`;
  const workspaces = readdirSync(folderPath);
  const changedPackageJsons = await detectPackageJsonDependencyChanges();
  updateGitIgnore({ filesToIgnore: [temporaryFolder] });

  const temporaryFolderPath = `${projectAbsolutePath}/${temporaryFolder}`;
  const folderAlreadyExists = existsSync(temporaryFolderPath);
  if (!folderAlreadyExists) {
    mkdirSync(temporaryFolderPath);
  }

  workspaces.forEach(async (workspace) => {
    const workspacePath = `${folderPath}/${workspace}`;
    const workspacePackageJsonPath = `${workspacePath}/package.json`;

    const workspacePackages = detectUsedLocalPackages({
      workspace: `apps/${workspace}`,
      projectAbsolutePath,
    });

    let requiresPackageLockChange = forceUpdate;

    if (!requiresPackageLockChange) {
      requiresPackageLockChange = !!workspacePackages.find((workspacePackage) => {
        const relativeLocalPackagePackageJsonPath = `${workspacePackage.path}/package.json`;
        return changedPackageJsons.has(relativeLocalPackagePackageJsonPath);
      });
    }

    if (!requiresPackageLockChange) {
      const relativeWorkspacePackageJsonPath = `${workspacesFolder}/${workspace}/package.json`;
      requiresPackageLockChange = changedPackageJsons.has(relativeWorkspacePackageJsonPath);
    }

    if (!requiresPackageLockChange) {
      console.log(`Skipping ${workspace} as nothing was changed.`);
      return;
    }

    const workspacePackageLockPath = `${workspacePath}/package-lock.json`;
    const tempFolder = `${temporaryFolderPath}/temp-${workspace}`;
    const tempFolderPackageLockPath = `${tempFolder}/package-lock.json`;
    const folderAlreadyExists = existsSync(tempFolder);
    if (!folderAlreadyExists) {
      mkdirSync(tempFolder);
    }

    copyFileSync(`${projectAbsolutePath}/package.json`, `${tempFolder}/package.json`);
    const workspacePackageLockExists = existsSync(workspacePackageLockPath);
    if (workspacePackageLockExists) {
      copyFileSync(workspacePackageLockPath, tempFolderPackageLockPath);
    }

    const tempWorkspacesFolder = `${tempFolder}/${workspacesFolder}`;
    const tempWorkspacesFolderExists = existsSync(tempWorkspacesFolder);
    if (!tempWorkspacesFolderExists) {
      mkdirSync(tempWorkspacesFolder);
    }

    const tempWorkspaceFolder = `${tempWorkspacesFolder}/${workspace}`;
    const tempWorkspaceFolderExists = existsSync(tempWorkspaceFolder);
    if (!tempWorkspaceFolderExists) {
      mkdirSync(tempWorkspaceFolder);
    }

    copyFileSync(workspacePackageJsonPath, `${tempWorkspaceFolder}/package.json`);

    if (workspacePackages.length > 0) {
      const tempPackagesFolder = `${tempFolder}/${packagesFolder}`;
      const tempPackagesFolderExists = existsSync(tempPackagesFolder);
      if (!tempPackagesFolderExists) {
        mkdirSync(tempPackagesFolder);
      }

      workspacePackages.forEach((workspacePackage) => {
        const tempLocalPackagePath = `${tempFolder}/${workspacePackage.path}`;
        const folderExists = existsSync(tempLocalPackagePath);
        if (!folderExists) {
          mkdirSync(tempLocalPackagePath);
        }

        copyFileSync(
          `${projectAbsolutePath}/${workspacePackage.path}/package.json`,
          `${tempLocalPackagePath}/package.json`,
        );
      });
    }

    const generateLockFileCommand = getPackageManagerCreateLockfileOnlyCommand();

    await executeTerminalCommand({
      command: `cd ${tempFolder} && ${generateLockFileCommand}`,
    });
    copyFileSync(tempFolderPackageLockPath, workspacePackageLockPath);
    rmSync(tempFolder, { recursive: true, force: true });
  });
};
