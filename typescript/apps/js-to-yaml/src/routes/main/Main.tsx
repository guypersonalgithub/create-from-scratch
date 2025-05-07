import { useGetBreakpoint } from "../../breakpoints";
import { EverythingYouNeed } from "./EverythingYouNeed";
import { GetStarted } from "./GetStarted";
import { TopSection } from "./TopSection";
import { Convert } from "./Convert";
import { CoreFeatures } from "./CoreFeatures";

export const Main = () => {
  const { breakpoint } = useGetBreakpoint();
  const isDesktop = breakpoint === "desktop";

  return (
    <div>
      <div
        style={{
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
        }}
      >
        <TopSection isDesktop={isDesktop} />
        <Convert isDesktop={isDesktop} />
        <EverythingYouNeed isDesktop={isDesktop} />
        <GetStarted isDesktop={isDesktop} />
        <CoreFeatures isDesktop={isDesktop} />
      </div>
    </div>
  );
};
