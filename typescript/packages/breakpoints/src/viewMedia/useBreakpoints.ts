import { useContext } from "react";
import { type Breakpoint } from "../types";
import { BreakpointsContext, type BreakpointsContextType } from "./BreakpointsContext";

type GetBreakpoints<T extends Record<string, Breakpoint>> = {
  breakpoints: T;
};

export const getBreakpoints = <T extends Record<string, Breakpoint>>({
  breakpoints,
}: GetBreakpoints<T>) => {
  const useBreakpoints = (): BreakpointsContextType<T> => {
    const context = useContext(BreakpointsContext);
    if (!context) {
      throw new Error("useBreakpoints must be used within a BreakpointsProvider");
    }

    return context as BreakpointsContextType<T>;
  };

  return { useBreakpoints };
};
