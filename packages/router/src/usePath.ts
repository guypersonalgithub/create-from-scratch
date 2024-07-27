import { isTheSameURL } from "./utils";

export const usePath = () => {
  const getPathName = () => {
    return window.location.pathname;
  };

  type MoveToArgs = {
    pathname: string;
    queryParams?: Record<string, unknown>;
  };

  const moveTo = ({ pathname, queryParams = {} }: MoveToArgs) => {
    const sameURL = isTheSameURL({ pathname, queryParams });
    if (sameURL) {
      return;
    }

    const url = new URL(`${window.location.origin}${pathname}`);
    for (const param in queryParams) {
      const paramValue = queryParams[param];
      url.searchParams.set(param, String(paramValue));
    }

    window.history.pushState({ path: pathname }, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return {
    getPathName,
    moveTo,
  };
};
