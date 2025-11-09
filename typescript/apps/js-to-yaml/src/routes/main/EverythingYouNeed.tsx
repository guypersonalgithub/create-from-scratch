import { DisplayCard } from "../../customizedComponents";
import { Bidirectional, Download, Thunder } from "@packages/icons";
import { dynatic } from "../../dynatic-css.config";

export const EverythingYouNeed = () => {
  return (
    <div
      className={dynatic`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        ${(config) => config.utils.widthMediaQuery({ to: "800px" })} {
          margin-bottom: 50px;
        }
      `}
    >
      <div
        className={dynatic`
          width: fit-content;
          font-weight: 500;
          border-radius: 100%;
          white-space: nowrap;
          border: 1px solid ${(config) => config.colors.defaultBorder};
          transition: ${(config) => config.shared.defaultTransition};
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
          margin: 0 auto;
          font-size: 12px;
          color: ${(config) => config.colors.thirdColor};
        `}
      >
        Powerful Features
      </div>
      <div
        className={dynatic`
          font-size: 50px;
          font-weight: bold;
          text-align: center;
        `}
      >
        Everything You Need
      </div>
      <div
        className={dynatic`
          color: ${(config) => config.colors.thirdColor};
          font-size: 20px;
          text-align: center;
          margin-bottom: 20px;
        `}
      >
        Our JavaScript to YAML converter comes packed with features to make your development
        workflow smoother.
      </div>
      <div
        className={dynatic`
          display: flex;
          gap: 30px;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          flex-direction: row;

          ${(config) => config.utils.widthMediaQuery({ to: "1300px" })} {
            flex-direction: column;
          }
        `}
      >
        <DisplayCard
          icon={
            <Thunder
              className={dynatic`
              width: 24px;
              height: 24px;
            `}
            />
          }
          title="Lightning Fast"
          content="Convert complex JavaScript objects to YAML in mere moments."
        />
        <DisplayCard
          icon={
            <Bidirectional
              className={dynatic`
              width: 24px;
              height: 24px;
            `}
            />
          }
          title="Bidirectional"
          content="Convert from JavaScript to YAML and back again with perfect fidelity."
        />
        <DisplayCard
          icon={
            <Download
              className={dynatic`
              width: 24px;
              height: 24px;
            `}
            />
          }
          title="Easy to Use"
          content="Download your converted YAML files or copy directly to clipboard with one click."
        />
      </div>
    </div>
  );
};
