import {
  detectAllRepositoryDependencies,
  getPackageVersions,
  arePackageJsonDependenciesEqual,
  iterateOverPackageJsons,
} from "@packages/detect-repository-dependencies";
import { detectFileChanges } from "@packages/detect-file-changes";
import { getProjectAbsolutePath } from "@packages/paths";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { updateGitIgnore } from "@packages/git";
import { detectUsedLocalPackages } from "@packages/packages";
import { getFile } from "@packages/files";
import { getPackageManagerCreateLockfileOnlyCommand } from "@packages/package-manager";
import { executeTerminalCommand } from "@packages/terminal-utils";

type GeneratePackageLockArgs = {
  workspacesFolders?: string[];
  packagesFolders?: string[];
  temporaryFolder?: string;
  forceUpdate?: boolean;
};

export const generatePackageLock = async ({
  workspacesFolders = ["apps"],
  packagesFolders = ["packages"],
  temporaryFolder = "temp",
  forceUpdate,
}: GeneratePackageLockArgs) => {
  const projectAbsolutePath = getProjectAbsolutePath();
  updateGitIgnore({ filesToIgnore: [temporaryFolder] });
  const temporaryFolderPath = `${projectAbsolutePath}/${temporaryFolder}`;

  const { packageJsonPaths } = detectAllRepositoryDependencies({
    skipDependencies: true,
  });

  const packageJsonPathsArray = [...packageJsonPaths];
  const pathsThatWereChanged = new Set<string>();
  const dependenciesWereChanged =
    forceUpdate ||
    detectFileChanges({
      cacheFolderPath: "temp",
      cacheFileName: "cache.json",
      filePaths: packageJsonPathsArray,
      compareCacheAndCurrentCallback: (current = {}, previously = "{}") => {
        const parsedCachedChanges = JSON.parse(previously);
        const differentAmountOfPackageJsons =
          Object.keys(current).length !== Object.keys(parsedCachedChanges).length;

        if (differentAmountOfPackageJsons) {
          return true;
        }

        for (const property in current) {
          const currentLastChange = current[property];
          const cachedLastChange = parsedCachedChanges[property];
          if (currentLastChange !== cachedLastChange) {
            const currentFile = getFile({ path: property }) ?? "{}";
            const parsedCurrentFile = JSON.parse(currentFile);
            const cachedFile =
              getFile({ path: `temp/files/${encodeURIComponent(property)}` }) ?? "{}";
            const parsedCachedFile = JSON.parse(cachedFile);

            const areEqual = arePackageJsonDependenciesEqual({
              packageJson1: parsedCurrentFile,
              packageJson2: parsedCachedFile,
            });

            if (!areEqual) {
              pathsThatWereChanged.add(
                property.replace(`${projectAbsolutePath}/`, "").replace("/package.json", ""),
              );
            }
          }
        }

        return pathsThatWereChanged.size > 0;
      },
    });

  if (!dependenciesWereChanged) {
    return;
  }

  for await (const workspacesFolder of workspacesFolders) {
    const folderPath = `${projectAbsolutePath}/${workspacesFolder}`;
    const workspaces = readdirSync(folderPath);

    for await (const workspace of workspaces) {
      const workspacePath = `${folderPath}/${workspace}`;
      const workspacePackageJsonPath = `${workspacePath}/package.json`;

      const workspacePackages = detectUsedLocalPackages({
        workspace: `${workspacesFolder}/${workspace}`,
        projectAbsolutePath,
      });

      let requiresPackageLockChange = forceUpdate;

      if (!requiresPackageLockChange) {
        requiresPackageLockChange = !!workspacePackages.find((workspacePackage) => {
          const relativeLocalPackagePackageJsonPath = `${workspacePackage.path}/package.json`;
          return pathsThatWereChanged.has(relativeLocalPackagePackageJsonPath);
        });
      }

      if (!requiresPackageLockChange) {
        const relativeWorkspacePackageJsonPath = `${workspacesFolder}/${workspace}/package.json`;
        requiresPackageLockChange = pathsThatWereChanged.has(relativeWorkspacePackageJsonPath);
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
        packagesFolders.forEach((packagesFolder) => {
          const tempPackagesFolder = `${tempFolder}/${packagesFolder}`;
          const tempPackagesFolderExists = existsSync(tempPackagesFolder);
          if (!tempPackagesFolderExists) {
            mkdirSync(tempPackagesFolder);
          }
        });

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
    }
  }
};
