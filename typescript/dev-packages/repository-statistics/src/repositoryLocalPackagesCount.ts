import { getProjectAbsolutePath } from "@packages/paths";
import { getAmountOfFolders } from "@packages/files";

export const getRepositoryLocalPackagesCount = () => {
  const localPackagePaths = ["packages", "dev-packages"];

  const projectAbsolutePath = getProjectAbsolutePath() + "/typescript";

  const count = localPackagePaths.reduce((sum, path) => {
    const fullPath = `${projectAbsolutePath}/${path}`;

    const folders = getAmountOfFolders({ path: fullPath });

    console.log(`Number of ${path}: ${folders}`);

    return sum + folders;
  }, 0);

  return count;
};
