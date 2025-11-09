import { dynatic } from "../../dynatic-css.config";
import { MainLogo } from "../../customizedComponents";
import { MainAd } from "./MainAd";

export const TopSection = () => {
  return (
    <div
      className={dynatic`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 50px;
        min-height: 100vh;
        margin-bottom: 20px;
        text-align: center;
        flex-direction: row;

        ${(config) => config.utils.widthMediaQuery({ to: "1300px" })} {
          flex-direction: column;
        }
      `}
    >
      <MainLogoSection />
      <MainAd />
    </div>
  );
};

const MainLogoSection = () => {
  return (
    <div
      className={dynatic`
          margin-left: 20px;
          width: 300px;

          ${(config) => config.utils.widthMediaQuery({ to: "1000px" })} {
            width: 290px;
          }
        `}
    >
      <MainLogo />
      <div
        className={dynatic`
          font-size: 50px;
          font-weight: bolder;
        `}
      >
        JS to YAML
      </div>
    </div>
  );
};
