import { Breakpoint } from "./types";

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

  let closestKey: G = currentBreakpoint as G;
  let smallestDistance = Infinity;
  const value = window.innerWidth;

  for (const key of options) {
    const range = breakpoints[key];
    if (!range) {
      continue;
    }

    let distance = 0;
    if (value < range.min) {
      distance = range.min - value;
    } else if (value > range.max) {
      distance = value - range.max;
    } else {
      distance = 0;
    }

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestKey = key;
    }
  }

  return closestKey;
};

type getFirstBreakpoint<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export const getFirstBreakpoint = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: getFirstBreakpoint<T>) => {
  for (const current in breakpoints) {
    return current;
  }
};
