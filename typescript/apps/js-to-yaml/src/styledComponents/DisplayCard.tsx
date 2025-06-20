import { type ReactNode } from "react";
import { StyledCard } from "./StyledCard";
import { useBreakpoints } from "../breakpoints";

type DisplayCardProps = {
  icon: ReactNode;
  title: string;
  content: string;
};

export const DisplayCard = ({ icon, title, content }: DisplayCardProps) => {
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({ updateOn: ["smallDesktop", "tablet"] });
  const isTablet = breakpoint === "tablet";

  return (
    <StyledCard
      style={{
        border: "1px solid var(--theme-border)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "0px",
        width: isTablet ? undefined : "400px",
        margin: isTablet ? "0 30px" : undefined,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--theme-thirdColorBackground)",
          borderRadius: "100%",
          color: "var(--theme-thirdColor)",
          height: "40px",
          width: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "var(--theme-transition)",
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{title}</div>
      <div style={{ color: "var(--theme-thirdColor)", textAlign: "center" }}>{content}</div>
    </StyledCard>
  );
};
