import { useState, useEffect, useCallback } from "react";
import { parseURLQueryParams } from "./utils";

type UseQueryParamsStateArgs = {
  specificParams: string[];
};

export const useQueryParamsState = (
  { specificParams }: UseQueryParamsStateArgs = { specificParams: [] },
) => {
  const getQueryParamValues = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    const { paramsObject } = parseURLQueryParams({ params, specificParams });

    return paramsObject;
  }, [specificParams]);

  const [queryParams, setQueryParams] = useState(getQueryParamValues());

  useEffect(() => {
    const handleUrlChange = () => {
      const newParamValues = getQueryParamValues();
      let shouldUpdate = false;

      specificParams.forEach((specificParam) => {
        if (newParamValues[specificParam] !== queryParams[specificParam]) {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setQueryParams(newParamValues);
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("pushstate", handleUrlChange);
    window.addEventListener("replacestate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("pushstate", handleUrlChange);
      window.removeEventListener("replacestate", handleUrlChange);
    };
  }, [getQueryParamValues, specificParams]);

  return queryParams;
};

export const getQueryParams = () => {
  const queryParams: Record<string, string | number> = {};

  const splittedQueryString = window.location.search.slice(1, window.location.search.length);
  const queryStringParams = splittedQueryString.split("&").filter(Boolean);

  queryStringParams.forEach((queryParam) => {
    const variableValueSplit = queryParam.split("=");
    queryParams[variableValueSplit[0]] = variableValueSplit[1];
  });

  return queryParams;
};
