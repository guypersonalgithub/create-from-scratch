import { rateLimit } from "../utils";
import { getLatestPackageRegistryData } from "./getLatestPackageRegistryData";

type GetLatestPackagesRegistryDataByBatchArgs = {
  packageNames: string[];
};

export const getLatestPackagesRegistryDataByBatch = async ({
  packageNames,
}: GetLatestPackagesRegistryDataByBatchArgs) => {
  const promises = packageNames.map((pack) => {
    return getLatestPackageRegistryData({ packageName: pack });
  });

  await rateLimit({ promises, concurrencyLimit: 10, delayMS: 5000 });
};
