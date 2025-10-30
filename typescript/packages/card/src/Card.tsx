import { type CSSProperties, type ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";

type CardProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const Card = ({ className, style, children }: CardProps) => {
  const cardClasses = dynatic`
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(83, 63, 63, 0.1);
    padding: 1rem;
    background-color: #fff;
  `;

  // combineStringsWithSpaces

  return (
    <div className={className ? `${cardClasses} ${className}` : cardClasses} style={style}>
      {children}
    </div>
  );
};
