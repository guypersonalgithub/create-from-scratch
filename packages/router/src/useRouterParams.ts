import { useContext, useEffect, useState } from "react";
import { sharedState } from "./sharedState";
import { RouterContext } from "./routerContext";

type UseRouteParamsStateArgs = {
  specificParams?: string[];
};

export const useRouteParamsState = (args?: UseRouteParamsStateArgs) => {
  const withinRouter = useContext(RouterContext);
  if (!withinRouter) {
    throw new Error("Attempted to use useRouteParamsState on a level above a router.");
  }
  const { specificParams = [] } = args ?? {};
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = sharedState.subscribe({
      listener: (newParamValues) => {
        let shouldUpdate = false;

        const paramArray = specificParams.length > 0 ? specificParams : Object.keys(newParamValues);

        for (let i = 0; i < paramArray.length; i++) {
          const specificParam = paramArray[i];
          if (newParamValues[specificParam] !== routeParams[specificParam]) {
            shouldUpdate = true;
            break;
          }
        }

        if (shouldUpdate) {
          setRouteParams(newParamValues);
        }
      },
      initial: true,
    });

    return () => {
      unsubscribe();
    };
  }, [specificParams]);

  return routeParams;
};

type UseGetRouteParamsArgs = {
  onChange: (data: Record<string, string>) => void;
};

export const getRouteParams = ({ onChange }: UseGetRouteParamsArgs) => {
  const unsubscribe = sharedState.subscribe({
    listener: onChange,
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
