import { CSSProperties } from "react";
import "./AnimatedBurgerIcon.css";

type AnimatedBurgerIconProps = {
  style?: CSSProperties;
  burgerLineStyle?: CSSProperties;
  isOpen: boolean;
  onClick: () => void;
};

export const AnimatedBurgerIcon = ({
  style,
  burgerLineStyle,
  isOpen,
  onClick,
}: AnimatedBurgerIconProps) => {
  const className = "burger" + (isOpen ? " open" : "");

  return (
    <button className={className} style={style} onClick={onClick}>
      <span style={burgerLineStyle} />
      <span style={burgerLineStyle} />
      <span style={burgerLineStyle} />
    </button>
  );
};
