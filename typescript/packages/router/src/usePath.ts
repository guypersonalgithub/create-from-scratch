import { useEffect, useState } from "react";
import { isTheSameURL } from "./utils";
import { generateURL, type FrontendArgs } from "@packages/url";

export const usePathState = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleUrlChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("pushstate", handleUrlChange);
    window.addEventListener("replacestate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("pushstate", handleUrlChange);
      window.removeEventListener("replacestate", handleUrlChange);
    };
  }, []);

  return {
    path,
  };
};

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
