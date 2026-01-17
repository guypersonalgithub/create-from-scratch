import { type ReactNode, useEffect, useState, useRef } from "react";
import { type RouterContentProps, type RouterProps } from "./types";
import { RouterContext, SubRouterContext } from "./routerContext";
import { useScrollToTheTopManual } from "@packages/hooks";
import { useGetRouteData } from "./useGetRouteData";
import { IS_ROUTER } from "./symbols";

export const Router = ({ paths, wrapperClassName, wrapperStyle }: RouterProps) => {
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
          wrapperClassName={wrapperClassName}
          wrapperStyle={wrapperStyle}
        />
      </SubRouterContext.Provider>
    </RouterContext.Provider>
  );
};

const RouterContent = ({
  passedPath,
  paths,
  route,
  wrapperClassName,
  wrapperStyle,
}: RouterContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollToContainerTop } = useScrollToTheTopManual();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    scrollToContainerTop({ element: ref.current });
  }, [passedPath]);

  return (
    <div ref={ref} className={wrapperClassName} style={wrapperStyle}>
      {route || (paths["404"] as ReactNode) || null}
    </div>
  );
};

Router[IS_ROUTER] = true;

