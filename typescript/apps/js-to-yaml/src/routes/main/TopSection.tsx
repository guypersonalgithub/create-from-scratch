import { MainLogo } from "../../styledComponents";
import { MainAd } from "./MainAd";

type TopSectionProps = {
  isDesktop: boolean;
};

export const TopSection = ({ isDesktop }: TopSectionProps) => {
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
      <div style={{ marginLeft: "20px", width: "300px" }}>
        <MainLogo />
        <div style={{ fontSize: "50px", fontWeight: "bolder" }}>JS to YAML</div>
      </div>
      <MainAd />
    </div>
  );
};
