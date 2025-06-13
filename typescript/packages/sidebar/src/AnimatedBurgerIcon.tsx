import { type CSSProperties, useEffect, useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!buttonRef.current || !spanRef.current) {
      return;
    }

    const lineHeight = spanRef.current.offsetHeight;
    buttonRef.current.style.setProperty("--line-height", `${lineHeight}px`);
  }, [burgerLineStyle]);

  const className = "burger" + (isOpen ? " open" : "");

  return (
    <button className={className} style={style} onClick={onClick} ref={buttonRef}>
      <span ref={spanRef} style={burgerLineStyle} />
      <span style={burgerLineStyle} />
      <span style={burgerLineStyle} />
    </button>
  );
};
