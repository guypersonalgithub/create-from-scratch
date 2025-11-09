import { EverythingYouNeed } from "./EverythingYouNeed";
import { GetStarted } from "./GetStarted";
import { TopSection } from "./TopSection";
import { Convert } from "./Convert";
import { CoreFeatures } from "./CoreFeatures";
import { dynatic } from "../../dynatic-css.config";

export const Main = () => {
  return (
    <div>
      <div
        className={dynatic`
          color: ${(config) => config.colors.mainColor};
          transition: ${(config) => config.shared.defaultTransition};
        `}
      >
        <TopSection />
        <Convert />
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
          <GetStarted />
          <CoreFeatures />
        </div>
      </div>
    </div>
  );
};
