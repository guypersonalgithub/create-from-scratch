import { CSSProperties, ReactNode } from "react";

type CardProps = {
  style?: CSSProperties;
  children: ReactNode;
};

export const Card = ({ style, children }: CardProps) => {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "1rem",
        backgroundColor: "#fff",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
