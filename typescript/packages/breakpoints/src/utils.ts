import { Breakpoint } from "./types";

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
