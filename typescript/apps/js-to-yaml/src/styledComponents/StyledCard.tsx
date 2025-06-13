import { Card } from "@packages/card";
import { type CSSProperties, type ReactNode } from "react";

type StyledCardProps = {
  style?: CSSProperties;
  children: ReactNode;
};

export const StyledCard = ({ style, children }: StyledCardProps) => {
  return (
    <Card
      style={{
        color: "var(--theme-color)",
        transition: "var(--theme-transition)",
        backgroundColor: "var(--theme-accent)",
        marginBottom: "10px",
        ...style,
      }}
    >
      {children}
    </Card>
  );
};
