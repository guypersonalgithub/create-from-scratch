import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { getProjectAbsolutePath } from "../paths";
import { detectWorkspacePackages } from "../packages";
import { executeTerminalCommand } from "../terminal";

export const generatePackageLock = async () => {
  {
    const projectAbsolutePath = getProjectAbsolutePath();
    const workspacesFolder = "apps";
    const packagesFolder = "packages";
    const folderPath = `${projectAbsolutePath}/${workspacesFolder}`;
    const workspaces = readdirSync(folderPath);
    workspaces.forEach(async (workspace) => {
      const workspacePath = `${folderPath}/${workspace}`;
      const workspacePackageJsonPath = `${workspacePath}/package.json`;
      const workspacePackageLockPath = `${workspacePath}/package-lock.json`;
      const tempFolder = `${projectAbsolutePath}/temp-${workspace}`;
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

      const workspacePackages = detectWorkspacePackages({
        workspace: `apps/${workspace}`,
        projectAbsolutePath,
      });

      const localPackages = [...(workspacePackages ?? [])];
      if (localPackages.length > 0) {
        const tempPackagesFolder = `${tempFolder}/${packagesFolder}`;
        const tempPackagesFolderExists = existsSync(tempPackagesFolder);
        if (!tempPackagesFolderExists) {
          mkdirSync(tempPackagesFolder);
        }

        localPackages.forEach((localPackage) => {
          const tempLocalPackagePath = `${tempFolder}/${localPackage}`;
          const folderExists = existsSync(tempLocalPackagePath);
          if (!folderExists) {
            mkdirSync(tempLocalPackagePath);
          }

          copyFileSync(
            `${projectAbsolutePath}/${localPackage}/package.json`,
            `${tempLocalPackagePath}/package.json`,
          );
        });
      }

      await executeTerminalCommand({
        command: `cd ${tempFolder} && npm i --package-lock-only --ignore-scripts`,
      });
      copyFileSync(tempFolderPackageLockPath, workspacePackageLockPath);
      rmSync(tempFolder, { recursive: true, force: true });
    });
  }
};
