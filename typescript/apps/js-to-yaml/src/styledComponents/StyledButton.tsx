import { Button } from "@packages/button";
import { ArrowRightHead } from "@packages/icons";
import { CSSProperties, ReactNode } from "react";

type StyledButtonProps = {
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
};

export const StyledButton = ({ style, onClick, children }: StyledButtonProps) => {
  return (
    <Button
      style={{
        borderRadius: "10px",
        padding: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        minWidth: "150px",
        minHeight: "44px",
        backgroundColor: "rgba(0, 119, 184, 0.976)",
        color: "white",
        fontSize: "16px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
      {/* <div style={{ position: "absolute", right: "15px", top: "12px" }}> */}
      <ArrowRightHead />
      {/* </div> */}
    </Button>
  );
};
