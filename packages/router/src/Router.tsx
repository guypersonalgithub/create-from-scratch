import { ReactNode, useEffect, useState, isValidElement } from "react";
import { RouterPathGuard, RouterPaths } from "./types";
import { useInnerRouteParams } from "./useRouterParams";
import { grabFirstPath } from "./utils";

type RouterProps = {
  paths: RouterPaths;
};

export const Router = ({ paths }: RouterProps) => {
  const { setRouterParams, resetRouterParams } = useInnerRouteParams();
  const [path, setPath] = useState<`/${string}`>(window.location.pathname as `/${string}`);

  useEffect(() => {
    const onLocationChange = () => {
      resetRouterParams();
      setPath(window.location.pathname as `/${string}`);
    };

    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  const getCurrentRoute = () => {
    return (basicPath() || pathBreaker() || paths["404"]) as ReactNode;
  };

  const basicPath = () => {
    const currentPath = paths[path];
    if (isValidElement(currentPath)) {
      return currentPath;
    }
  };

  const pathBreaker = () => {
    const nestedLevels = path.split("/");
    let currentStage = paths;
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
          setRouterParams(firstPath, nestedLevels[i]);
          currentStage = currentStage[firstPath] as RouterPaths;
        } else {
          currentStage = currentStage["/*"] as RouterPaths;
        }
      }

      if (typeof currentStage === "function") {
        currentStage = (currentStage as RouterPathGuard)() as RouterPaths;
      }
    }

    if (!currentStage) {
      return;
    }

    if (isValidElement(currentStage)) {
      return currentStage;
    }

    return isValidElement(currentStage["/"]) ? currentStage["/"] : null;
  };

  return <div>{getCurrentRoute()}</div>;
};
