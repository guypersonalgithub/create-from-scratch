import { getProjectAbsolutePath } from "../typescript/dev-packages/paths/src";
import { getAmountOfFolders } from "../typescript/dev-packages/files/src";

export const getRepositoryLocalPackagesCount = () => {
  const localPackagePaths = ["packages", "dev-packages"];

  const projectAbsolutePath = getProjectAbsolutePath() + "/typescript";

  const count = localPackagePaths.reduce((sum, path) => {
    const fullPath = `${projectAbsolutePath}/${path}`;

    const folders = getAmountOfFolders({ path: fullPath });

    console.log(`Number of ${path}: ${folders}`);

    return sum + folders;
  }, 0);

  console.log(`Total number of packages: ${count}`);
};

