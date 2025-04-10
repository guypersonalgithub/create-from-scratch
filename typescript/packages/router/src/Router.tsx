import { ReactNode, useEffect, useState, useRef } from "react";
import { RouterContentProps, RouterProps } from "./types";
import { RouterContext, SubRouterContext } from "./routerContext";
import { useScrollToTheTopManual } from "@packages/hooks";
import { useGetRouteData } from "./useGetRouteData";

export const Router = ({ paths, wrapperStyle }: RouterProps) => {
  const [path, setPath] = useState<`/${string}`>(window.location.pathname as `/${string}`);
  const routeParams = useRef<Record<string, string>>({});
  const { route, passedPath } = useGetRouteData({ path, paths, routeParams });

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname as `/${string}`);
      routeParams.current = {};
    };

    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  return (
    <RouterContext.Provider value={{ routeParams }}>
      <SubRouterContext.Provider value={{ shortenedPath: path, parentPassedPath: passedPath }}>
        <RouterContent
          passedPath={passedPath}
          paths={paths}
          route={route}
          wrapperStyle={wrapperStyle}
        />
      </SubRouterContext.Provider>
    </RouterContext.Provider>
  );
};

const RouterContent = ({ passedPath, paths, route, wrapperStyle }: RouterContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollFirstOverflowedParentToTop } = useScrollToTheTopManual();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    scrollFirstOverflowedParentToTop({ element: ref.current });
  }, [passedPath]);

  return (
    <div ref={ref} style={wrapperStyle}>
      {route || (paths["404"] as ReactNode) || null}
    </div>
  );
};

export const IS_ROUTER = Symbol("isRouter");

Router[IS_ROUTER] = true;
