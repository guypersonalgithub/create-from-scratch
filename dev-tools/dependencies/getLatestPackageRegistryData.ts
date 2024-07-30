import { sendRequest } from "@packages/request";
import { NPMRegistry } from "./types";

type GetLatestPackageRegistryDataArgs = {
  packageName: string;
  awaitRequest?: boolean;
};

export const getLatestPackageRegistryData = async ({
  packageName,
  awaitRequest = true,
}: GetLatestPackageRegistryDataArgs) => {
  const request = sendRequest<NPMRegistry>({
    url: `https://registry.npmjs.org/${packageName}/latest`,
    method: "GET",
  });

  if (!awaitRequest) {
    return request;
  }

  const data = await request;

  return data;
};
