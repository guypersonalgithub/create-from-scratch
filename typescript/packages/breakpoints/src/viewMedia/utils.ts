import { type Breakpoint } from "../types";
import { getClosestBreakpointKey } from "../utils";
import { type ConstructedBreakpoint, type constructuedMediaBreakpoints } from "./types";

type ConstructMediaBreakpointsArgs<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export const constructMediaBreakpoints = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: ConstructMediaBreakpointsArgs<T>) => {
  const constructuedMediaBreakpoints = {} as Record<keyof T, ConstructedBreakpoint>;

  for (const breakpoint in breakpoints) {
    const { min, max } = breakpoints[breakpoint];
    const mediaBreakpoint: ConstructedBreakpoint[] = [];
    if (min !== 0) {
      mediaBreakpoint.push(`(min-width: ${min}px)`);
    }

    if (max !== Infinity) {
      mediaBreakpoint.push(`(max-width: ${max}px)`);
    }

    constructuedMediaBreakpoints[breakpoint] = mediaBreakpoint.join(
      " and ",
    ) as ConstructedBreakpoint;
  }

  return constructuedMediaBreakpoints;
};

type GetCurrentBreakpointArgs<T extends Record<string, Breakpoint>> = {
  mediaBreakpoints: constructuedMediaBreakpoints<T>;
};

export const getCurrentBreakpoint = <T extends Record<string, Breakpoint>>({
  mediaBreakpoints,
}: GetCurrentBreakpointArgs<T>) => {
  for (const mediaBreakpoint in mediaBreakpoints) {
    const query = mediaBreakpoints[mediaBreakpoint];
    if (window.matchMedia(query).matches) {
      return mediaBreakpoint as keyof T;
    }
  }
};

type GetCurrentBreakpointBasedOffOptionsArgs<
  T extends Record<string, Breakpoint>,
  G extends keyof T,
> = {
  mediaBreakpoints: constructuedMediaBreakpoints<T>;
  breakpoints: T;
  options: G[];
};

export const getCurrentBreakpointBasedOffOptions = <
  T extends Record<string, Breakpoint>,
  G extends keyof T,
>({
  mediaBreakpoints,
  breakpoints,
  options,
}: GetCurrentBreakpointBasedOffOptionsArgs<T, G>) => {
  const currentBreakpoint = getCurrentBreakpoint({ mediaBreakpoints });
  if (options.includes(currentBreakpoint as G)) {
    return currentBreakpoint;
  }

  return getClosestBreakpointKey({ breakpoints, options, currentBreakpoint });
};
