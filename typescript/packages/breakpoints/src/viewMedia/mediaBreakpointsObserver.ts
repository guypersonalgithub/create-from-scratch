import { Observer } from "@packages/design-patterns";
import { type Breakpoint } from "../types";
import {
  constructMediaBreakpoints,
  getCurrentBreakpoint,
  getCurrentBreakpointBasedOffOptions,
} from "./utils";
import { useEffect, useState } from "react";

type InitializeMediaBreakpointsArgs<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export type UseGetBreakpointArgs<T extends Record<string, Breakpoint>, G extends keyof T> = {
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

export const initializeMediaBreakpoints = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: InitializeMediaBreakpointsArgs<T>) => {
  const mediaBreakpoints = constructMediaBreakpoints({ breakpoints });
  const currentBreakpoint = getCurrentBreakpoint({ mediaBreakpoints });
  const observer = new Observer({ breakpoint: currentBreakpoint });

  const useInitializeBreakpoints = () => {
    useEffect(() => {
      const mqls: { label: Extract<keyof T, string>; media: MediaQueryList }[] = [];
      for (const breakpoint in mediaBreakpoints) {
        const query = mediaBreakpoints[breakpoint];
        mqls.push({
          label: breakpoint,
          media: window.matchMedia(query),
        });
      }

      const onChange = ({
        matches,
        label,
      }: {
        matches: boolean;
        label: Extract<keyof T, string>;
      }) => {
        if (!matches) {
          return;
        }

        observer.setState({ breakpoint: label });
      };

      mqls.forEach((mql) =>
        mql.media.addEventListener("change", () =>
          onChange({ matches: mql.media.matches, label: mql.label }),
        ),
      );

      return () => {
        mqls.forEach((mql) =>
          mql.media.removeEventListener("change", () =>
            onChange({ matches: mql.media.matches, label: mql.label }),
          ),
        );
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
      getCurrentBreakpointBasedOffOptions({
        mediaBreakpoints,
        breakpoints,
        options: updateOn,
      }) as G,
    );

    useEffect(() => {
      const unsubscribe = observer.subscribe({
        initial: true,
        full: true,
        callback: ({ breakpoint }) => {
          if (updateOn.includes(breakpoint as G)) {
            setBreakpoint(breakpoint as G);
          } else if ((includeMismatchAbove || includeMismatchBelow) && breakpoint) {
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
