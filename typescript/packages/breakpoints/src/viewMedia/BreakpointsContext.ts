import { createContext } from "react";
import { type Breakpoint } from "../types";
import { type Observer } from "@packages/design-patterns";
import { type UseGetBreakpointArgs } from "./mediaBreakpointsObserver";

export type BreakpointsContextType<T extends Record<string, Breakpoint>> = {
  observer: Observer<{
    breakpoint: keyof T | undefined;
  }>;
  useGetBreakpoint: <G extends keyof T>({
    updateOn,
    includeMismatchAbove,
    defaultAboveBreakpoint,
    includeMismatchBelow,
    defaultBelowBreakpoint,
  }: UseGetBreakpointArgs<T, G>) => {
    breakpoint: G | undefined;
  };
};

export const BreakpointsContext = createContext<BreakpointsContextType<any> | null>(null);
