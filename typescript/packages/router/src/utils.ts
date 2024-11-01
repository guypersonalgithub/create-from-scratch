import { RouterPaths } from "./types";
import { areStringArraysEqual } from "@packages/utils";

type GrabFirstPathsArgs = {
  currentStage: RouterPaths;
};

export const grabFirstPath = ({ currentStage }: GrabFirstPathsArgs) => {
  for (const path in currentStage) {
    return path;
  }

  return;
};

type IsntTheSameURLArgs = {
  url: URL;
};

export const isTheSameURL = ({ url }: IsntTheSameURLArgs) => {
  const url2 = new URL(window.location.href);
  return areEqualURLs({ url1: url, url2 });
};

type AreEqualURLsArgs = {
  url1: URL;
  url2: URL;
};

export const areEqualURLs = ({ url1, url2 }: AreEqualURLsArgs) => {
  const urlsAreEqual = url1.host === url2.host && url1.pathname === url2.pathname;
  const queryParamsAreEqual = areQueryParamsEqual({ url1, url2 });

  return urlsAreEqual && queryParamsAreEqual;
};

const areQueryParamsEqual = ({ url1, url2 }: AreEqualURLsArgs) => {
  const params1 = new URLSearchParams(url1.search);
  const params2 = new URLSearchParams(url2.search);

  const { paramsObject: paramsObject1, length: length1 } = parseURLQueryParams({ params: params1 });
  const { paramsObject: paramsObject2, length: length2 } = parseURLQueryParams({ params: params2 });

  if (length1 !== length2) {
    return false;
  }

  for (const property in paramsObject1) {
    const value1 = paramsObject1[property];
    const value2 = paramsObject2[property];

    if (Array.isArray(value1) && Array.isArray(value2)) {
      const areEqual = areStringArraysEqual({ array1: value1, array2: value2 });
      if (!areEqual) {
        return false;
      }

      continue;
    }

    if (value1 !== value2) {
      return false;
    }
  }

  return true;
};

type ParseURLQueryParamsArgs = {
  params: URLSearchParams;
  specificParams?: string[];
};

export const parseURLQueryParams = ({ params, specificParams = [] }: ParseURLQueryParamsArgs) => {
  const paramsObject: Record<string, string | string[]> = {};
  const pickSpecificParamsOnly = specificParams.length > 0;

  const paramsArray = Array.from(params.entries());

  paramsArray.forEach((param) => {
    const [key, value] = param;

    if (pickSpecificParamsOnly && !specificParams.includes(key)) {
      return;
    }

    if (!paramsObject[key]) {
      paramsObject[key] = value;
      return;
    }

    if (paramsObject[key] && !Array.isArray(paramsObject[key])) {
      paramsObject[key] = [paramsObject[key] as string];
    }

    (paramsObject[key] as string[]).push(value);
  });

  return {
    paramsObject,
    length: paramsArray.length,
  };
};
