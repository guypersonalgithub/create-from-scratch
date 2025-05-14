import { useGetBreakpoint } from "../../breakpoints";
import { MainLogo } from "../../styledComponents";
import { MainAd } from "./MainAd";

export const TopSection = () => {
  const { breakpoint } = useGetBreakpoint({
    updateOn: ["smallDesktop"],
    includeMismatchBelow: true,
  });
  const isDesktop = breakpoint === "smallDesktop";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isDesktop ? "row" : "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "50px",
        minHeight: "100vh",
        marginBottom: "20px",
        textAlign: "center",
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
    <div style={isDesktop ? { marginLeft: "20px", width: "300px" } : { width: "290px" }}>
      <MainLogo />
      <div style={{ fontSize: "50px", fontWeight: "bolder" }}>JS to YAML</div>
    </div>
  );
};
