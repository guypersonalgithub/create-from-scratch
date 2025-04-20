import { Button } from "@packages/button";
import { ArrowRightHead } from "@packages/icons";
import { CSSProperties, ReactNode } from "react";
import styles from "./StyledButton.module.css";

type StyledButtonProps = {
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
};

export const StyledButton = ({ style, onClick, children }: StyledButtonProps) => {
  return (
    <Button
      className={styles.StyledButton}
      style={{
        borderRadius: "10px",
        padding: "10px",
        paddingLeft: "30px",
        paddingRight: "30px",
        minWidth: "150px",
        minHeight: "44px",
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
