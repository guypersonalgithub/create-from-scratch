import { Breakpoint } from "./types";

type GetClosestBreakpointKeyArgs<T extends Record<string, Breakpoint>, G extends keyof T> = {
  breakpoints: T;
  options: G[];
  currentBreakpoint?: keyof T;
};

export const getClosestBreakpointKey = <T extends Record<string, Breakpoint>, G extends keyof T>({
  breakpoints,
  options,
  currentBreakpoint,
}: GetClosestBreakpointKeyArgs<T, G>) => {
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
