import { AtleastOne } from "@packages/utils";

export type QueryParams = Record<
  string,
  string | number | boolean | string[] | number[] | boolean[]
>;

export type FrontendArgs = AtleastOne<
  {
    baseURL?: string;
    pathname?: string;
    queryParams?: QueryParams;
  } & (OverrideParams | OverrideSpecificParams)
>;

type OverrideParams = {
  overrideParams?: boolean;
  overrideSpecificParams?: never;
};

type OverrideSpecificParams = {
  overrideParams?: never;
  overrideSpecificParams?: string[];
};

export type BackendArgs = {
  baseURL: string;
  queryParams?: QueryParams;
};
