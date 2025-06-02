import { getBreakpoints } from "@packages/breakpoints";

export const breakpoints = {
  mobile: { min: 0, max: 400 },
  tablet: { min: 400, max: 800 },
  smallDesktop: { min: 800, max: 1000 },
  mediumDesktop: { min: 1000, max: 1300 },
  desktop: { min: 1300, max: Infinity },
};

const { useBreakpoints } = getBreakpoints({ breakpoints });

export { useBreakpoints };
