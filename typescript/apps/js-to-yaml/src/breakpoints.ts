import { getBreakpoint } from "@packages/breakpoints";

const { useGetBreakpoint } = getBreakpoint({
  breakpoints: { mobile: { min: 0, max: 600 }, desktop: { min: 600, max: Infinity } },
});

export { useGetBreakpoint };
