import { Button } from "@packages/button";
import { ArrowRight2 } from "@packages/icons";
import { CSSProperties, ReactNode } from "react";
import styles from "./StyledButton.module.css";

type Variants = "blue" | "green" | "ghost";

type GetVariant = {
  variant: Variants;
};

const getVariant = ({ variant }: GetVariant) => {
  if (variant === "blue") {
    return styles.BlueStyledButton;
  }

  if (variant === "green") {
    return styles.GreenStyledButton;
  }

  return styles.GhostStyledButton;
};

type StyledButtonProps = {
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
  addArrow?: boolean;
  variant?: Variants;
};

export const StyledButton = ({
  style,
  onClick,
  children,
  addArrow,
  variant = "blue",
}: StyledButtonProps) => {
  return (
    <Button
      className={getVariant({ variant })}
      style={{
        borderRadius: "6px",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "16px",
        paddingRight: "16px",
        fontSize: "14px",
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        height: "fit-content",
        width: "fit-content",
        whiteSpace: "nowrap",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
      {addArrow ? <ArrowRight2 size={16} /> : null}
    </Button>
  );
};
