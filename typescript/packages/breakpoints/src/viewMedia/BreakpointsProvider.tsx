import { type Breakpoint } from "../types";
import { BreakpointsContext } from "./BreakpointsContext";
import { initializeMediaBreakpoints } from "./mediaBreakpointsObserver";
import { type BreakpointsContextType } from "./BreakpointsContext";
import { type ReactNode } from "react";

type BreakpointProviderProps<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
  children: ReactNode;
};

export const BreakpointsProvider = <T extends Record<string, Breakpoint>>({
  breakpoints,
  children,
}: BreakpointProviderProps<T>) => {
  const { observer, useInitializeBreakpoints, useGetBreakpoint } = initializeMediaBreakpoints({
    breakpoints,
  });

  useInitializeBreakpoints();

  return (
    <BreakpointsContext.Provider
      value={{ observer, useGetBreakpoint } as BreakpointsContextType<T>}
    >
      {children}
    </BreakpointsContext.Provider>
  );
};
