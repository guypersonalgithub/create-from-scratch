import { useState, useEffect, useCallback } from "react";
import { getUrlParams } from "./utils";

let queryParams: Record<string, string | number> = {};

type UseQueryParamsStateArgs = {
  specificParams?: string[];
};

export const useQueryParamsState = (args?: UseQueryParamsStateArgs) => {
  const { specificParams = [] } = args ?? {};

  const getQueryParamValues = useCallback(() => {
    if (specificParams.length === 0) {
      return getUrlParams();
    }

    const params = new URLSearchParams(window.location.search);
    const paramValues: Record<string, string> = {};

    specificParams.forEach((specificParam) => {
      const paramValue = params.get(specificParam);
      if (!paramValue) {
        return;
      }

      paramValues[specificParam] = paramValue;
    });
    return paramValues;
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

export const useQueryParams = () => {
  return queryParams;
};

export const useInnerQueryParams = () => {
  const setQueryParams = () => {
    const splittedQueryString = window.location.search.slice(1, window.location.search.length);
    const queryStringParams = splittedQueryString.split("&");

    queryStringParams.forEach((queryParam) => {
      const variableValueSplit = queryParam.split("=");
      queryParams[variableValueSplit[0]] = variableValueSplit[1];
    });
  };

  const resetQueryParams = () => {
    queryParams = {};
  };

  return {
    setQueryParams,
    resetQueryParams,
  };
};
