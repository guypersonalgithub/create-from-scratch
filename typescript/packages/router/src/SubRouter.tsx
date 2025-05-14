import { ReactNode, useEffect, useRef } from "react";
import { RouterContentProps, RouterProps } from "./types";
import { useGetRouteData } from "./useGetRouteData";
import { useRouterContext } from "./useRouterContext";
import { useScrollToTheTopManual } from "@packages/hooks";
import { SubRouterContext } from "./routerContext";
import { useSubRouterContext } from "./useSubRouterContext";
import { IS_SUB_ROUTER } from "./symbols";

export const SubRouter = ({ paths, wrapperStyle }: RouterProps) => {
  const { routeParams } = useRouterContext();
  const { shortenedPath, parentPassedPath } = useSubRouterContext();
  const { route, passedPath, basePath } = useGetRouteData({ path: shortenedPath, paths, routeParams, parentPassedPath });

  return (
    <SubRouterContext.Provider value={{ shortenedPath: basePath, parentPassedPath: passedPath }}>
      <RouterContent
        passedPath={passedPath}
        paths={paths}
        route={route}
        wrapperStyle={wrapperStyle}
      />
    </SubRouterContext.Provider>
  );
};

const RouterContent = ({
  passedPath,
  paths,
  route,
  wrapperStyle,
}: RouterContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollFirstOverflowedParentToTop } = useScrollToTheTopManual();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    scrollFirstOverflowedParentToTop({ element: ref.current });
  }, [passedPath]);

  return (
    <div ref={ref} style={{...wrapperStyle }}>
      {route || (paths["404"] as ReactNode) || null}
    </div>
  );
};

SubRouter[IS_SUB_ROUTER] = true;
