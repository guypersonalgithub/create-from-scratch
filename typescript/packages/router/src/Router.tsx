import { ReactNode, useEffect, useState, isValidElement, CSSProperties, useRef } from "react";
import { RouterPathGuard, RouterPaths } from "./types";
import { grabFirstPath } from "./utils";
import { RouterContext } from "./routerContext";

type RouterProps = {
  paths: RouterPaths;
  wrapperStyle?: CSSProperties;
};

export const Router = ({ paths, wrapperStyle }: RouterProps) => {
  const [path, setPath] = useState<`/${string}`>(window.location.pathname as `/${string}`);
  const routeParams = useRef<Record<string, string>>({});

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname as `/${string}`);
    };

    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  const getRouteData = () => {
    const newRouteParams: Record<string, string> = {};

    const currentPath = paths[path];
    if (isValidElement(currentPath)) {
      return currentPath;
    }

    const nestedLevels = path.split("/");
    let currentStage = paths;

    const updateRouteParams = (path: string, nestedLevel: string) => {
      const currentKey = path.slice(2, path.length);
      newRouteParams[currentKey] = nestedLevel;
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

    routeParams.current = newRouteParams;

    if (!currentStage) {
      return (paths["404"] as ReactNode) || null;
    }

    if (isValidElement(currentStage)) {
      return currentStage;
    }

    const component = isValidElement(currentStage["/"]) ? currentStage["/"] : null;

    return component || (paths["404"] as ReactNode) || null;
  };

  return (
    <RouterContext.Provider value={{ routeParams: routeParams.current }}>
      <div style={wrapperStyle}>{getRouteData()}</div>
    </RouterContext.Provider>
  );
};
