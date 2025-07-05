import { readdirSync } from "fs";
import { shouldSkipFile } from "./shouldSkipFile";

type GetRepositoryPackageJsonsArgs = {
  projectAbsolutePath: string;
  include: Set<string>;
  exclude: Set<string>;
  includePatterns: RegExp[];
  excludePatterns: RegExp[];
  skipFilesAndFolders: string[];
};

export const getRepositoryPackageJsons = ({
  projectAbsolutePath,
  include,
  exclude,
  includePatterns,
  excludePatterns,
  skipFilesAndFolders,
}: GetRepositoryPackageJsonsArgs) => {
  return iterateOverFolders({
    projectAbsolutePath,
    relativePath: "",
    iteratedPaths: new Set<string>(),
    packageJsonPaths: new Set<string>(),
    include,
    exclude,
    includePatterns,
    excludePatterns,
    skipFilesAndFolders:
      skipFilesAndFolders.length > 0 ? skipFilesAndFolders : ["node_modules", ".github", ".git"],
  });
};

type IterateOverFoldersArgs = GetRepositoryPackageJsonsArgs & {
  relativePath: string;
  iteratedPaths: Set<string>;
  packageJsonPaths: Set<string>;
};

const iterateOverFolders = ({
  projectAbsolutePath,
  relativePath,
  iteratedPaths,
  packageJsonPaths,
  include,
  exclude,
  includePatterns,
  excludePatterns,
  skipFilesAndFolders,
}: IterateOverFoldersArgs) => {
  const fullPath = `${projectAbsolutePath}${relativePath}`;
  const files = readdirSync(fullPath, { withFileTypes: true });
  if (iteratedPaths.has(fullPath)) {
    // TODO: Remove this console.error, if two local packages use another local package as a dependency it can be detected as a circular path even though it isn't.
    console.error(
      "Encountered the same folder path twice, there might be a circular path somewhere within the file system, skipping.",
      `Path: ${fullPath}`,
    );

    return packageJsonPaths;
  }
  iteratedPaths.add(fullPath);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (skipFilesAndFolders.includes(file.name)) {
      continue;
    }

    const fullPathWithFile = `${fullPath}/${file.name}`;

    const skipFile = shouldSkipFile({
      fullPathWithFile,
      exclude,
      include,
      file,
      excludePatterns,
      includePatterns,
    });

    if (skipFile) {
      continue;
    }

    const isDirectory = file.isDirectory();

    if (isDirectory) {
      iterateOverFolders({
        projectAbsolutePath,
        relativePath: `${relativePath}/${file.name}`,
        iteratedPaths,
        packageJsonPaths,
        include,
        exclude,
        includePatterns,
        excludePatterns,
        skipFilesAndFolders,
      });

      continue;
    }

    packageJsonPaths.add(fullPathWithFile);
  }

  return packageJsonPaths;
};
