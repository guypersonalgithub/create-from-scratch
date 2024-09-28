import { listChangedFiles } from "./listChangedFiles";
import { compareChangesInJsonsBetweenVersions } from "./compareChangesInJsonsBetweenVersions";
import { getProjectAbsolutePath } from "@packages/paths";

export const detectPackageJsonDependencyChanges = async () => {
  const changedPackageJsons = new Set<string>();
  const changedFiles = await listChangedFiles();
  const packageJsonFile = "package.json";
  const projectAbsolutePath = getProjectAbsolutePath();

  if (!changedFiles) {
    return changedPackageJsons;
  }

  for (const changedFile of changedFiles) {
    const { file, status } = changedFile;
    if (status === "D") {
      continue;
    }

    if (!file.includes(packageJsonFile)) {
      continue;
    }

    const changesWereMade = await compareChangesInJsonsBetweenVersions({
      projectAbsolutePath,
      filePath: file,
      objectProperties: [
        "dependencies",
        "devDependencies",
        "optionalDependencies",
        "peerDependencies",
      ],
    });

    if (changesWereMade) {
      changedPackageJsons.add(file);
    }
  }

  return changedPackageJsons;
};
