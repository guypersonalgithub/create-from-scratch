import { listChangedFiles } from "./listChangedFiles";
import { compareChangesInJsonsBetweenVersions } from "./compareChangesInJsonsBetweenVersions";

export const detectPackageJsonDependencyChanges = async () => {
  const changedPackageJsons = new Set<string>();
  const changedFiles = await listChangedFiles();
  const packageJsonFile = "package.json";

  if (!changedFiles) {
    return changedPackageJsons;
  }

  for (const changedFile of changedFiles) {
    const { file } = changedFile;
    if (!file.includes(packageJsonFile)) {
      continue;
    }

    const changesWereMade = await compareChangesInJsonsBetweenVersions({
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
