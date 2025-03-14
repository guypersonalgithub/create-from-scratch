import { Button } from "@packages/button";
import { ArrowRightHead } from "@packages/icons";
import { CSSProperties, ReactNode } from "react";

type StyledButtonProps = {
  style?: CSSProperties;
  children: ReactNode;
};

export const StyledButton = ({ style, children }: StyledButtonProps) => {
  return (
    <Button
      style={{
        borderRadius: "10px",
        padding: "10px",
        minWidth: "150px",
        minHeight: "44px",
        backgroundColor: "rgba(0, 119, 184, 0.976)",
        color: "white",
        fontSize: "16px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        ...style,
      }}
    >
      {children}
      <div style={{ position: "absolute", right: "15px", top: "12px" }}>
        <ArrowRightHead />
      </div>
    </Button>
  );
};
