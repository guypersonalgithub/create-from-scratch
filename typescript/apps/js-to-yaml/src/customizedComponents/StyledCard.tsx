import { Card } from "@packages/card";
import { type CSSProperties, type ReactNode } from "react";
import { dynatic } from "../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/utils";

type StyledCardProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const StyledCard = ({ className, style, children }: StyledCardProps) => {
  return (
    <Card
      className={combineStringsWithSpaces(
        dynatic`
          color: ${(config) => config.colors.mainColor};
          background-color: ${(config) => config.colors.accent};
          margin-bottom: 10px;
          transition: ${(config) => config.shared.defaultTransition};
        `,
        className,
      )}
      style={style}
    >
      {children}
    </Card>
  );
};
