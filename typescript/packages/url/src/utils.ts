import { BackendArgs, FrontendArgs, QueryParams } from "./types";

type ArrangeSearchParamsArgs = {
  queryParams?: QueryParams;
};

export const arrangeSearchParams = ({ queryParams = {} }: ArrangeSearchParamsArgs) => {
  const params = new URLSearchParams();

  for (const param in queryParams) {
    const values = queryParams[param];
    if (Array.isArray(values)) {
      values.forEach((value) => {
        params.append(param, String(value));
      });
    } else {
      params.append(param, String(values));
    }
  }

  return params;
};

export const getFrontendBaseURL = ({
  baseURL,
  pathname,
  queryParams,
  overrideParams,
  overrideSpecificParams,
}: FrontendArgs) => {
  const urlParts = [baseURL ?? window.location.origin, pathname ?? window.location.pathname];
  const url = new URL(urlParts.join(""));

  const searchParams = arrangeSearchParams({ queryParams });

  if (overrideParams) {
    url.search = searchParams.toString();
    return url;
  }

  const params = new URLSearchParams(window.location.search);

  if (overrideSpecificParams) {
    overrideSpecificParams.forEach((param) => {
      params.delete(param);
    });
  }

  searchParams.forEach((value, key) => {
    params.append(key, value);
  });

  url.search = params.toString();

  return url;
};

export const getBackendBaseURL = ({ baseURL, queryParams }: BackendArgs) => {
  const url = new URL(baseURL);
  const searchParams = arrangeSearchParams({ queryParams });
  url.search = searchParams.toString();

  return url;
};
