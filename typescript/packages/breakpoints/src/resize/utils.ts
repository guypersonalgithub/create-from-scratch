import { Breakpoint } from "../types";
import { getClosestBreakpointKey } from "../utils";

type GetCurrentBreakpointArgs<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export const getCurrentBreakpoint = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: GetCurrentBreakpointArgs<T>) => {
  const { innerWidth } = window;

  for (const current in breakpoints) {
    const { min, max } = breakpoints[current];
    if (innerWidth >= min && innerWidth <= max) {
      return current;
    }
  }

  return getFirstBreakpoint({ breakpoints }) as keyof T;
};

type GetCurrentBreakpointBasedOffOptionsArgs<
  T extends Record<string, Breakpoint>,
  G extends keyof T,
> = {
  breakpoints: T;
  options: G[];
};

export const getCurrentBreakpointBasedOffOptions = <
  T extends Record<string, Breakpoint>,
  G extends keyof T,
>({
  breakpoints,
  options,
}: GetCurrentBreakpointBasedOffOptionsArgs<T, G>) => {
  const currentBreakpoint = getCurrentBreakpoint({ breakpoints });
  if (options.includes(currentBreakpoint as G)) {
    return currentBreakpoint;
  }

  return getClosestBreakpointKey({ breakpoints, options, currentBreakpoint });
};

type GetFirstBreakpointArgs<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export const getFirstBreakpoint = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: GetFirstBreakpointArgs<T>) => {
  for (const current in breakpoints) {
    return current;
  }
};
