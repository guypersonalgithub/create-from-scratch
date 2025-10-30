import { useBreakpoints } from "../../breakpoints";
import { dynatic } from "../../dynatic-css.config";
import { MainLogo } from "../../customizedComponents";
import { MainAd } from "./MainAd";

export const TopSection = () => {
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({
    updateOn: ["smallDesktop"],
    includeMismatchBelow: true,
    defaultAboveBreakpoint: "smallDesktop",
  });
  const isDesktop = breakpoint === "smallDesktop";

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
      `}
      style={{
        flexDirection: isDesktop ? "row" : "column",
      }}
    >
      <MainLogoSection isDesktop={isDesktop} />
      <MainAd />
    </div>
  );
};

type MainLogoSectionProps = {
  isDesktop: boolean;
};

const MainLogoSection = ({ isDesktop }: MainLogoSectionProps) => {
  return (
    <div
      className={
        isDesktop
          ? dynatic`
              margin-left: 20px;
              width: 300px;
            `
          : dynatic`
              width: 290xp;
            `
      }
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
