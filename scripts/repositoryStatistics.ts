import {
  getAllRepositoryFolderCommittedFiles,
  getRepositoryFiles,
  getRepositoryLocalPackagesCount,
} from "../typescript/dev-packages/repository-statistics/src";

const getRepositoryStatistics = async () => {
  const count = getRepositoryLocalPackagesCount();
  console.log(`Total number of packages: ${count}`);
  const files = await getRepositoryFiles();
  console.log(`Number of files: ${files.length}`);
  // const folderStatistics = await getAllRepositoryFolderCommittedFiles({
  //   fileTypes: [".tsx", ".ts"],
  //   splitTests: true,
  // });
  // console.log(folderStatistics);
};

getRepositoryStatistics();
