import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { getProjectAbsolutePath } from "../paths";
import { detectWorkspacePackages } from "../packages";
import { executeTerminalCommand } from "../terminal";
import { detectPackageJsonDependencyChanges, updateGitIgnore } from "../git";
import { getPackageManagerCreateLockfileOnlyCommand } from "../packageManager";

export const generatePackageLock = async () => {
  {
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

      const workspacePackages = detectWorkspacePackages({
        workspace: `apps/${workspace}`,
        projectAbsolutePath,
      });

      const localPackages = [...(workspacePackages ?? [])];

      let requiresPackageLockChange = !!localPackages.find((localPackage) => {
        const relativeLocalPackagePackageJsonPath = `${localPackage}/package.json`;
        return changedPackageJsons.has(relativeLocalPackagePackageJsonPath);
      });

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

      const generateLockFileCommand = getPackageManagerCreateLockfileOnlyCommand();

      await executeTerminalCommand({
        command: `cd ${tempFolder} && ${generateLockFileCommand}`,
      });
      copyFileSync(tempFolderPackageLockPath, workspacePackageLockPath);
      rmSync(tempFolder, { recursive: true, force: true });
    });
  }
};
