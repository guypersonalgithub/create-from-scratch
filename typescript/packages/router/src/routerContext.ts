import { createContext, type MutableRefObject } from "react";

export const RouterContext = createContext<{
  routeParams: MutableRefObject<Record<string, string>>;
} | null>(null);

export const SubRouterContext = createContext<{
  shortenedPath: `/${string}`;
  parentPassedPath: string;
} | null>(null);
