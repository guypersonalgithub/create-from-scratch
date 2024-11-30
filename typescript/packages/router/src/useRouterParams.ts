import { useCallback, useContext, useEffect, useState } from "react";
import { sharedState } from "./sharedState";
import { RouterContext } from "./routerContext";

type UseRouteParamsStateArgs = {
  specificParams: string[];
};

export const useRouteParamsState = (
  { specificParams }: UseRouteParamsStateArgs = { specificParams: [] },
) => {
  const withinRouter = useContext(RouterContext);
  if (!withinRouter) {
    throw new Error("Attempted to use useRouteParamsState on a level above a router.");
  }

  const getRequestedParams = useCallback(
    ({
      newParamValues,
      existingParams,
    }: {
      newParamValues: Record<string, string>;
      existingParams: Record<string, string>;
    }) => {
      let shouldUpdate = false;

      const paramArray = specificParams.length > 0 ? specificParams : Object.keys(newParamValues);

      for (let i = 0; i < paramArray.length; i++) {
        const specificParam = paramArray[i];
        if (newParamValues[specificParam] !== existingParams[specificParam]) {
          shouldUpdate = true;
          break;
        }
      }

      if (shouldUpdate) {
        return newParamValues;
      }
    },
    [specificParams],
  );

  const [routeParams, setRouteParams] = useState<Record<string, string>>(() => {
    const newParams =
      getRequestedParams({ newParamValues: sharedState.getState(), existingParams: {} }) ?? {};
    return newParams;
  });

  useEffect(() => {
    const unsubscribe = sharedState.subscribe({
      callback: (newParamValues) => {
        const paramsToUpdate = getRequestedParams({ newParamValues, existingParams: routeParams });
        if (paramsToUpdate) {
          setRouteParams(paramsToUpdate);
        }
      },
      full: true,
      initial: true,
    });

    return () => {
      unsubscribe();
    };
  }, [getRequestedParams]);

  return routeParams;
};

type UseGetRouteParamsArgs = {
  onChange: (data: Record<string, string>) => void;
};

export const getRouteParams = ({ onChange }: UseGetRouteParamsArgs) => {
  const unsubscribe = sharedState.subscribe({
    callback: onChange,
    full: true,
    initial: true,
  });

  return {
    unsubscribe,
  };
};

export const useInnerRouteParams = () => {
  const setRouterParams = (path: string, nestedLevel: string) => {
    const currentKey = path.slice(2, path.length);
    sharedState.setState({ [currentKey]: nestedLevel });
  };

  const resetRouterParams = () => {
    sharedState.setState({});
  };

  return {
    setRouterParams,
    resetRouterParams,
  };
};
