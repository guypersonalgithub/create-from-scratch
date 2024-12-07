import { ReactNode, useEffect, useState, isValidElement, CSSProperties, useRef } from "react";
import { RouterPathGuard, RouterPaths } from "./types";
import { useInnerRouteParams } from "./useRouterParams";
import { grabFirstPath } from "./utils";
import { RouterContext } from "./routerContext";

type RouterProps = {
  paths: RouterPaths;
  wrapperStyle?: CSSProperties;
};

type GetRouteDataArgs = {
  path: `/${string}`;
};

export const Router = ({ paths, wrapperStyle }: RouterProps) => {
  const { setRouterParams } = useInnerRouteParams();
  const [route, setRoute] = useState<ReactNode>(null);

  const getRouteData = ({
    path,
  }: GetRouteDataArgs): { component: ReactNode; routeParams: Record<string, string> } => {
    const routeParams: Record<string, string> = {};

    const currentPath = paths[path];
    if (isValidElement(currentPath)) {
      return { component: currentPath, routeParams };
    }

    const nestedLevels = path.split("/");
    let currentStage = paths;

    const updateRouteParams = (path: string, nestedLevel: string) => {
      const currentKey = path.slice(2, path.length);
      routeParams[currentKey] = nestedLevel;
    };

    for (let i = 1; i < nestedLevels.length; i++) {
      if (!currentStage) {
        break;
      }

      const currentPath = `/${nestedLevels[i]}` as `/${string}`;
      if (currentStage[currentPath]) {
        currentStage = currentStage[currentPath] as RouterPaths;
      } else {
        const firstPath = grabFirstPath({ currentStage }) as `/${string}`;
        if (firstPath && firstPath.slice(0, 2) === "/:") {
          if (nestedLevels[i].length === 0) {
            currentStage = currentStage["/"] as RouterPaths;
          } else {
            updateRouteParams(firstPath, nestedLevels[i]);
            currentStage = currentStage[firstPath] as RouterPaths;
          }
        } else {
          currentStage = currentStage["/*"] as RouterPaths;
        }
      }

      if (typeof currentStage === "function") {
        currentStage = (currentStage as RouterPathGuard)() as RouterPaths;
      }
    }

    if (!currentStage) {
      return { component: null, routeParams };
    }

    if (isValidElement(currentStage)) {
      return { component: currentStage, routeParams };
    }

    const component = isValidElement(currentStage["/"]) ? currentStage["/"] : null;

    return { component: component || (paths["404"] as ReactNode) || null, routeParams };
  };

  useEffect(() => {
    const onLocationChange = () => {
      const { component, routeParams } = getRouteData({
        path: window.location.pathname as `/${string}`,
      });
      setRouterParams(routeParams);
      setRoute(component);
    };

    onLocationChange();

    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  return (
    <RouterContext.Provider value={true}>
      <div style={wrapperStyle}>{route}</div>
    </RouterContext.Provider>
  );
};
