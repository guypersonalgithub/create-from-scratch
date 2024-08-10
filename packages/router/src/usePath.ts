import { isTheSameURL } from "./utils";
import { generateURL, FrontendArgs } from "@packages/url";

export const usePath = () => {
  const getPathName = () => {
    return window.location.pathname;
  };

  const moveTo = ({
    baseURL,
    pathname,
    queryParams = {},
    overrideParams,
    overrideSpecificParams,
  }: FrontendArgs) => {
    const url = generateURL({
      baseURL,
      pathname,
      queryParams,
      overrideParams,
      overrideSpecificParams,
    });

    const sameURL = isTheSameURL({ url });

    if (sameURL) {
      return;
    }

    window.history.pushState({ path: pathname }, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return {
    getPathName,
    moveTo,
  };
};
