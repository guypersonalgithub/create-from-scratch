import { useContext } from "react";
import { SubRouterContext } from "./routerContext";

export const useSubRouterContext = () => {
  const withinSubRouter = useContext(SubRouterContext);
  if (!withinSubRouter) {
    throw new Error("Attempted to use useSubRouterContext on a level above a router.");
  }

  return withinSubRouter;
};
