import { sendRequest } from "@packages/request";
import {
  type NPMRegistry,
  type NPMRegistryVersion,
} from "@packages/detect-repository-dependencies-types";

type NPMRegistryRequestArgs = {
  urlSuffix: string;
};

const NPMRegistryRequest = async <T>({ urlSuffix }: NPMRegistryRequestArgs) => {
  const url = `https://registry.npmjs.org/${urlSuffix}`;
  const response = sendRequest<T>({ url, method: "GET" });

  return response;
};

type GetPackageVersionsArgs = {
  packageName: string;
};

export const getPackageVersions = async ({ packageName }: GetPackageVersionsArgs) => {
  const response = NPMRegistryRequest<NPMRegistry>({ urlSuffix: packageName });

  return response;
};

type GetPackageVersionDataArgs = {
  packageName: string;
  version: string;
};

export const getPackageVersionData = async ({
  packageName,
  version,
}: GetPackageVersionDataArgs) => {
  const response = NPMRegistryRequest<NPMRegistryVersion>({
    urlSuffix: `${packageName}/${version}`,
  });

  return response;
};
