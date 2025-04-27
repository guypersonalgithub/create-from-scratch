import { getRepositoryFileCount } from "./repositoryFileCount";
import { getRepositoryLocalPackagesCount } from "./repositoryLocalPackagesCount";

const getRepositoryStatistics = () => {
  getRepositoryLocalPackagesCount();
  getRepositoryFileCount();
};

getRepositoryStatistics();
