import { type ReactNode } from "react";
import { StyledCard } from "./StyledCard";
import { dynatic } from "../dynatic-css.config";

type DisplayCardProps = {
  icon: ReactNode;
  title: string;
  content: string;
};

export const DisplayCard = ({ icon, title, content }: DisplayCardProps) => {
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

        ${(config) => config.utils.widthMediaQuery({ from: "1000px" })} {
          width: 400px;
        }

        ${(config) => config.utils.widthMediaQuery({ to: "800px" })} {
          margin: 0 30px;
        }
      `}
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
