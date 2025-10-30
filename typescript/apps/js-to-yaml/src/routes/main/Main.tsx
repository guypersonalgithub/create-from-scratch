import { useBreakpoints } from "../../breakpoints";
import { EverythingYouNeed } from "./EverythingYouNeed";
import { GetStarted } from "./GetStarted";
import { TopSection } from "./TopSection";
import { Convert } from "./Convert";
import { CoreFeatures } from "./CoreFeatures";
import { dynatic } from "../../dynatic-css.config";

export const Main = () => {
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({ updateOn: ["desktop", "tablet"] });
  const isDesktop = breakpoint === "desktop";

  return (
    <div>
      <div
        className={dynatic`
          color: ${(config) => config.colors.mainColor};
          transition: ${(config) => config.shared.defaultTransition};
        `}
      >
        <TopSection />
        <Convert isDesktop={isDesktop} />
        <EverythingYouNeed />
        <div
          className={dynatic`
            margin: 0 30px;
            display: flex;
            flex-flow: column;
            align-items: center;
            gap: 20px;
          `}
        >
          <GetStarted isDesktop={isDesktop} />
          <CoreFeatures isDesktop={isDesktop} />
        </div>
      </div>
    </div>
  );
};
