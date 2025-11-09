import { type CSSProperties, useEffect, useRef } from "react";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type AnimatedBurgerIconProps = {
  className?: string;
  style?: CSSProperties;
  burgerLineClassName?: string;
  burgerLineStyle?: CSSProperties;
  isOpen: boolean;
  onClick: () => void;
};

export const AnimatedBurgerIcon = ({
  className,
  style,
  burgerLineClassName,
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
  }, [burgerLineClassName, burgerLineStyle]);

  const spanClass = dynatic`
    width: 100%;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform-origin: center;
  `;

  return (
    <button
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10; 
        `,
        className,
      )}
      style={style}
      onClick={onClick}
      ref={buttonRef}
    >
      <span
        ref={spanRef}
        className={combineStringsWithSpaces(
          spanClass,
          isOpen &&
            dynatic`
              transform: rotate(45deg) translateY(calc(var(--line-height) * 2.5))  translateX(6px);
            `,
          burgerLineClassName,
        )}
        style={burgerLineStyle}
      />
      <span
        className={combineStringsWithSpaces(
          spanClass,
          dynatic`
            opacity: 0;
          `,
          burgerLineClassName,
        )}
        style={burgerLineStyle}
      />
      <span
        className={combineStringsWithSpaces(
          spanClass,
          dynatic`
            transform: rotate(-45deg) translateY(calc(var(--line-height) * -2))  translateX(4px);
          `,
          burgerLineClassName,
        )}
        style={burgerLineStyle}
      />
    </button>
  );
};
