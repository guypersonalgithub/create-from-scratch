import { isValidElement, type ReactNode, type RefObject } from "react";
import { type RouterPaths } from "./types";
import { getFirstPath } from "./utils";

type UseGetRouteDataArgs = {
  parentPassedPath?: string;
  path: `/${string}`;
  paths: RouterPaths;
  routeParams: RefObject<Record<string, string>>;
};

export const useGetRouteData = ({
  parentPassedPath = "",
  path,
  paths,
  routeParams,
}: UseGetRouteDataArgs) => {
  let passedPath = "";
  const basePath = (path.slice(parentPassedPath.length) as `/${string}`) || "/";

  const getRoute = (): ReactNode | (() => ReactNode) => {
    const potentialPaths = [paths[`${basePath}!`], paths[basePath]];
    for (let i = 0; i < potentialPaths.length; i++) {
      const current = potentialPaths[i];
      if (isValidElement(current)) {
        passedPath = basePath;

        return current;
      } else if (typeof current === "function") {
        const functionValue = current();
        if (isValidElement(functionValue)) {
          return current as () => ReactNode;
        }
      }
    }

    const nestedLevels = basePath.split("/");
    let currentStage = paths;

    const updateRouteParams = (path: string, nestedLevel: string) => {
      const currentKey = path.slice(2, path.length);
      routeParams.current[currentKey] = nestedLevel;
    };

    for (let i = 1; i < nestedLevels.length; i++) {
      if (!currentStage) {
        break;
      }

      const currentPath = `/${nestedLevels[i]}` as `/${string}`;
      passedPath += currentPath;

      if (currentStage[`${currentPath}!`]) {
        currentStage = currentStage[`${currentPath}!`] as RouterPaths;
        break;
      } else if (currentStage[currentPath]) {
        currentStage = currentStage[currentPath] as RouterPaths;
      } else {
        const firstPath = getFirstPath({ currentStage }) as `/${string}`;
        if (firstPath && firstPath.slice(0, 2) === "/:") {
          updateRouteParams(firstPath, nestedLevels[i]);
          if (currentStage[`${firstPath}!`]) {
            currentStage = currentStage[`${firstPath}!`] as RouterPaths;
            break;
          }

          currentStage = currentStage[firstPath] as RouterPaths;
        } else {
          if (currentStage["/*!"]) {
            currentStage = currentStage["/*!"] as RouterPaths;
            break;
          }

          currentStage = currentStage["/*"] as RouterPaths;
        }
      }
    }

    routeParams.current = routeParams.current;

    if (!currentStage) {
      return null;
    }

    if (isValidElement(currentStage)) {
      return currentStage;
    }

    let component: ReactNode = null;

    const defaultStageRoute = currentStage["/"];
    if (isValidElement(defaultStageRoute)) {
      component = defaultStageRoute;
    }

    return component;
  };

  let route = getRoute();
  route = typeof route === "function" ? route() : route;
  if (!isValidElement(route)) {
    route = null;
  }

  return { passedPath, route, basePath };
};
