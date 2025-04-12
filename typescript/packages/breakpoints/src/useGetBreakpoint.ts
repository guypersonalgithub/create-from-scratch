import { useEffect, useState } from "react";
import { Breakpoint } from "./types";
import { getFirstBreakpoint } from "./utils";

type GetBreakpointArgs<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export const getBreakpoint = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: GetBreakpointArgs<T>) => {
  const useGetBreakpoint = () => {
    const getCurrentBreakpoint = () => {
      const { innerWidth } = window;

      for (const current in breakpoints) {
        const { min, max } = breakpoints[current];
        if (innerWidth >= min && innerWidth <= max) {
          return current;
        }
      }

      return getFirstBreakpoint({ breakpoints });
    };

    const [breakpoint, setBreakpoint] = useState<keyof typeof breakpoints | undefined>(
      getCurrentBreakpoint(),
    );

    useEffect(() => {
      const onResize = () => {
        const { innerWidth } = window;

        for (const current in breakpoints) {
          const { min, max } = breakpoints[current];
          if (innerWidth >= min && innerWidth <= max) {
            setBreakpoint(current);
            break;
          }
        }
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, []);

    return { breakpoint };
  };

  return { useGetBreakpoint };
};
