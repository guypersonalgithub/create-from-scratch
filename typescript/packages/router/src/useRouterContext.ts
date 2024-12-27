import { useContext } from "react";
import { RouterContext } from "./routerContext";

export const useRouterContext = () => {
  const withinRouter = useContext(RouterContext);
  if (!withinRouter) {
    throw new Error("Attempted to use useRouterContext on a level above a router.");
  }

  return withinRouter;
};
