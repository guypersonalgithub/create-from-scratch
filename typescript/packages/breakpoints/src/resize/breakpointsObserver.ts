import { Observer } from "@packages/design-patterns";
import { type Breakpoint } from "../types";
import { getCurrentBreakpoint, getCurrentBreakpointBasedOffOptions } from "./utils";
import { useEffect, useRef, useState } from "react";

type InitializeBreakpointsArgs<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

type UseGetBreakpointArgs<T extends Record<string, Breakpoint>, G extends keyof T> = {
  updateOn: G[];
} & IncludeMismatchAbove<T, G> &
  IncludeMismatchBelow<T, G>;

type IncludeMismatchAbove<T extends Record<string, Breakpoint>, G extends keyof T> =
  | {
      includeMismatchAbove: true;
      defaultBelowBreakpoint?: G;
    }
  | {
      includeMismatchAbove?: never;
      defaultBelowBreakpoint?: never;
    };

type IncludeMismatchBelow<T extends Record<string, Breakpoint>, G extends keyof T> =
  | {
      includeMismatchBelow: true;
      defaultAboveBreakpoint?: G;
    }
  | {
      includeMismatchBelow?: never;
      defaultAboveBreakpoint?: never;
    };

export const initializeBreakpoints = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: InitializeBreakpointsArgs<T>) => {
  const currentBreakpoint = getCurrentBreakpoint({ breakpoints });
  const observer = new Observer({ breakpoint: currentBreakpoint });

  const useInitializeBreakpoints = () => {
    const lastBreakpoint = useRef<keyof T>(undefined);

    useEffect(() => {
      const onResize = () => {
        const currentBreakpoint = getCurrentBreakpoint({ breakpoints });
        if (currentBreakpoint !== lastBreakpoint.current) {
          observer.setState({ breakpoint: currentBreakpoint });
          lastBreakpoint.current = currentBreakpoint;
        }
      };

      window.addEventListener("resize", onResize, true);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, []);
  };

  const useGetBreakpoint = <G extends keyof T>({
    updateOn,
    includeMismatchAbove,
    defaultAboveBreakpoint,
    includeMismatchBelow,
    defaultBelowBreakpoint,
  }: UseGetBreakpointArgs<T, G>) => {
    const [breakpoint, setBreakpoint] = useState<G | undefined>(
      getCurrentBreakpointBasedOffOptions({ breakpoints, options: updateOn }) as G,
    );

    useEffect(() => {
      const unsubscribe = observer.subscribe({
        initial: true,
        full: true,
        callback: ({ breakpoint }) => {
          if (updateOn.includes(breakpoint as G)) {
            setBreakpoint(breakpoint as G);
          } else if (includeMismatchAbove || includeMismatchBelow) {
            if (includeMismatchBelow) {
              const max = breakpoints[breakpoint].max;
              const isBelowEverything = updateOn.every((b) => breakpoints[b].min >= max);
              setBreakpoint(isBelowEverything ? undefined : defaultAboveBreakpoint);
            } else {
              const min = breakpoints[breakpoint].min;
              const isAboveEverything = updateOn.every((b) => breakpoints[b].max <= min);
              setBreakpoint(isAboveEverything ? undefined : defaultBelowBreakpoint);
            }
          }
        },
      });

      return () => {
        unsubscribe();
      };
    }, [updateOn, includeMismatchAbove, includeMismatchBelow]);

    return {
      breakpoint,
    };
  };

  return {
    observer,
    useInitializeBreakpoints,
    useGetBreakpoint,
  };
};
