import { type ReactNode } from "react";
import { StyledCard } from "./StyledCard";
import { useBreakpoints } from "../breakpoints";
import { dynatic } from "../dynatic-css.config";

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
      className={dynatic`
        border: 1px solid ${(config) => config.colors.defaultBorder};
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: center;
        align-items: center;
        margin-bottom: 0;
      `}
      style={{
        width: isTablet ? undefined : "400px",
        margin: isTablet ? "0 30px" : undefined,
      }}
    >
      <div
        className={dynatic`
          background-color: ${(config) => config.colors.darkBackground};
          border-radius: 100%;
          color: ${(config) => config.colors.thirdColor};
          height: 40px;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: ${(config) => config.shared.defaultTransition};
        `}
      >
        {icon}
      </div>
      <div
        className={dynatic`
          font-size: 20px;
          font-weight: bold;
        `}
      >
        {title}
      </div>
      <div
        className={dynatic`
          color: ${(config) => config.colors.thirdColor};
          text-align: center;
        `}
      >
        {content}
      </div>
    </StyledCard>
  );
};
