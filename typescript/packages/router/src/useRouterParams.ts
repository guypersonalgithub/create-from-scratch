import { useContext } from "react";
import { RouterContext } from "./routerContext";

export const useRouteParamsState = () => {
  const withinRouter = useContext(RouterContext);
  if (!withinRouter) {
    throw new Error("Attempted to use useRouteParamsState on a level above a router.");
  }

  const { routeParams } = withinRouter;

  return routeParams;
};
