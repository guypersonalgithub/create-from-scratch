import { type ReactNode, useEffect, useRef } from "react";
import { type RouterContentProps, type RouterProps } from "./types";
import { useGetRouteData } from "./useGetRouteData";
import { useRouterContext } from "./useRouterContext";
import { useScrollToTheTopManual } from "@packages/hooks";
import { SubRouterContext } from "./routerContext";
import { useSubRouterContext } from "./useSubRouterContext";
import { IS_SUB_ROUTER } from "./symbols";

export const SubRouter = ({ paths, wrapperClassName, wrapperStyle }: RouterProps) => {
  const { routeParams } = useRouterContext();
  const { shortenedPath, parentPassedPath } = useSubRouterContext();
  const { route, passedPath, basePath } = useGetRouteData({
    path: shortenedPath,
    paths,
    routeParams,
    parentPassedPath,
  });

  return (
    <SubRouterContext.Provider value={{ shortenedPath: basePath, parentPassedPath: passedPath }}>
      <RouterContent
        passedPath={passedPath}
        paths={paths}
        route={route}
        wrapperClassName={wrapperClassName}
        wrapperStyle={wrapperStyle}
      />
    </SubRouterContext.Provider>
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
  const { scrollFirstOverflowedParentToTop } = useScrollToTheTopManual();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    scrollFirstOverflowedParentToTop({ element: ref.current });
  }, [passedPath]);

  return (
    <div ref={ref} className={wrapperClassName} style={wrapperStyle}>
      {route || (paths["404"] as ReactNode) || null}
    </div>
  );
};

SubRouter[IS_SUB_ROUTER] = true;
