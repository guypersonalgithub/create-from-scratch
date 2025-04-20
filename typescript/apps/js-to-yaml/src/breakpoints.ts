import { getBreakpoint } from "@packages/breakpoints";

const { useGetBreakpoint } = getBreakpoint({
  breakpoints: {
    mobile: { min: 0, max: 400 },
    tablet: { min: 400, max: 800 },
    desktop: { min: 800, max: Infinity },
  },
});

export { useGetBreakpoint };
