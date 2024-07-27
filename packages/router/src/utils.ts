import { RouterPaths } from "./types";
import { areObjectsEqual } from "@packages/utils";

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
  pathname: string;
  queryParams?: Record<string, unknown>;
};

export const isTheSameURL = ({ pathname, queryParams }: IsntTheSameURLArgs) => {
  const samePath = pathname === window.location.pathname;
  const urlParams = getUrlParams();
  const sameQueryParams = areObjectsEqual({ obj1: queryParams, obj2: urlParams });

  return samePath && sameQueryParams;
};

export const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const paramValues: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    paramValues[key] = value;
  }

  return paramValues;
};
