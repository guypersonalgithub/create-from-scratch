import { useContext } from "react";
import { Breakpoint } from "../types";
import { BreakpointsContext, BreakpointsContextType } from "./BreakpointsContext";

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
