import { updateGitIgnore } from "@packages/git";
import { getFile, lastTimeFilesWereChanged } from "@packages/files";
import { writeFileSync, mkdirSync, existsSync, copyFileSync, rmSync } from "fs";

type DetectFileChangesArgs = {
  cacheFolderPath: string;
  cacheFileName: string;
  filePaths: string[];
  compareCacheAndCurrentCallback: (current?: Record<string, string>, cache?: string) => boolean;
};

export const detectFileChanges = ({
  cacheFolderPath,
  cacheFileName,
  filePaths,
  compareCacheAndCurrentCallback,
}: DetectFileChangesArgs) => {
  try {
    updateGitIgnore({ filesToIgnore: [cacheFolderPath] });

    const cacheFilePath = `${cacheFolderPath}/${cacheFileName}`;
    const cachedChangesFile = getFile({ path: cacheFilePath });
    const lastChanges = lastTimeFilesWereChanged({ filePaths });

    if (!cachedChangesFile) {
      const folderAlreadyExists = existsSync(cacheFolderPath);
      if (!folderAlreadyExists) {
        mkdirSync(cacheFolderPath);
      }

      writeFileSync(cacheFilePath, JSON.stringify(lastChanges, null, 2));

      const cachedFilesFolder = `${cacheFolderPath}/files`;

      const filesCacheFolderAlreadyExist = existsSync(cachedFilesFolder);
      if (!filesCacheFolderAlreadyExist) {
        mkdirSync(cachedFilesFolder);
        cacheCurrentFileVersions({ filePaths, cachedFilesFolder });
      }

      return true;
    }

    const cachedFilesFolder = `${cacheFolderPath}/files`;
    const dirExists = existsSync(cachedFilesFolder);
    if (!dirExists) {
      mkdirSync(cachedFilesFolder);
      cacheCurrentFileVersions({ filePaths, cachedFilesFolder });

      return true;
    }

    const response = compareCacheAndCurrentCallback(lastChanges, cachedChangesFile);
    writeFileSync(cacheFilePath, JSON.stringify(lastChanges, null, 2));
    rmSync(cachedFilesFolder, { recursive: true });
    const filesCacheFolderAlreadyExist = existsSync(cachedFilesFolder);
    if (!filesCacheFolderAlreadyExist) {
      mkdirSync(cachedFilesFolder);
    }
    cacheCurrentFileVersions({ filePaths, cachedFilesFolder });

    return response;
  } catch (error) {
    console.error(error);
  }
};

type CacheCurrentFileVersionsArgs = {
  filePaths: string[];
  cachedFilesFolder: string;
};

const cacheCurrentFileVersions = ({
  filePaths,
  cachedFilesFolder,
}: CacheCurrentFileVersionsArgs) => {
  filePaths.forEach((file) => {
    const encodedFilePath = encodeURIComponent(file);
    const destination = `${cachedFilesFolder}/${encodedFilePath}`;
    copyFileSync(file, destination);
  });
};
