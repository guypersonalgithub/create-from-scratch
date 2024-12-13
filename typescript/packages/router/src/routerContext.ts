import { createContext } from "react";

export const RouterContext = createContext<{ routeParams: Record<string, string> }>({
  routeParams: {},
});
