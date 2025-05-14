import { useGetBreakpoint } from "../../breakpoints";
import { EverythingYouNeed } from "./EverythingYouNeed";
import { GetStarted } from "./GetStarted";
import { TopSection } from "./TopSection";
import { Convert } from "./Convert";
import { CoreFeatures } from "./CoreFeatures";

export const Main = () => {
  const { breakpoint } = useGetBreakpoint({ updateOn: ["desktop", "tablet"] });
  const isDesktop = breakpoint === "desktop";

  return (
    <div>
      <div
        style={{
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
        }}
      >
        <TopSection />
        <Convert isDesktop={isDesktop} />
        <EverythingYouNeed />
        <div
          style={{
            margin: "0 30px",
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <GetStarted isDesktop={isDesktop} />
          <CoreFeatures isDesktop={isDesktop} />
        </div>
      </div>
    </div>
  );
};
