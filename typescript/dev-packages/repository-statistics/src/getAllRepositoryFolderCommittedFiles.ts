import { countFilesLines, getFoldersInPath } from "@packages/files";
import { getProjectAbsolutePath } from "@packages/paths";
import { folderCommittedFiles } from "./folderCommittedFiles";
import { countTestsInFile } from "./countTestsInFile";
import { countRoughEstimateTokenCountInFiles } from "./countRoughEstimateTokenCountInFiles";

type GetAllRepositoryFolderCommittedFilesArgs = {
  fileTypes?: string[];
  splitTests?: boolean;
};

export const getAllRepositoryFolderCommittedFiles = async ({
  fileTypes,
  splitTests,
}: GetAllRepositoryFolderCommittedFilesArgs) => {
  const projectAbsolutePath = getProjectAbsolutePath() + "/typescript";

  const folders = ["apps", "dev-apps", "packages", "dev-packages"];
  const innerFolders = folders
    .map((folder) => {
      const path = `${projectAbsolutePath}/${folder}`;
      const innerFolders = getFoldersInPath({ path });
      const folderPaths = innerFolders.map((innerFolder) => `${path}/${innerFolder.name}`);

      return folderPaths;
    })
    .flat();
  const folderCallbacks: Promise<string[]>[] = [];

  folderCallbacks.push(
    ...innerFolders.map((folderPath) => folderCommittedFiles({ folderPath, fileTypes })),
  );

  const foldersFiles = await Promise.all(folderCallbacks);
  const foldersStatistics = foldersFiles.map((folderFiles, index) => {
    const files: string[] = splitTests ? [] : folderFiles;
    const tests: string[] = [];

    if (splitTests) {
      folderFiles.forEach((folderFile) => {
        if (folderFile.endsWith(".test.ts")) {
          tests.push(folderFile);
        } else {
          files.push(folderFile);
        }
      });
    }

    const path = innerFolders[index];
    const filesCount = files.length;
    const filesRowsCount = countFilesLines({ files });
    const testFilesCount = tests.length;
    const testsCount = tests.reduce((sum, current) => {
      return sum + countTestsInFile({ path: current });
    }, 0);
    const roughEstimatedTokensCount = countRoughEstimateTokenCountInFiles({ files });

    return {
      path,
      filesCount,
      filesRowsCount,
      testFilesCount,
      testsCount,
      roughEstimatedTokensCount,
    };
  });

  return foldersStatistics;
};
