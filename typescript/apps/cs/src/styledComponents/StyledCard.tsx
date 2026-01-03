import { Card, type CardProps } from "@packages/card";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../dynatic-css.config";
import { ReactNode } from "react";

type StyledCardProps = CardProps & {
  mainTitle?: ReactNode;
  subTitle?: ReactNode;
  variant?: "regular" | "large";
};

export const StyledCard = ({
  style,
  className,
  children,
  mainTitle,
  subTitle,
  variant = "regular",
}: StyledCardProps) => {
  const isLarge = variant === "large";

  return (
    <Card
      style={style}
      className={combineStringsWithSpaces(
        isLarge
          ? dynatic`
              background: linear-gradient(180deg, #1a1a1a, #111);
              boxShadow: 0 10px 30px rgba(0,0,0,0.4);
              padding: 24px;
              border-radius: 16px;
          `
          : dynatic`
              background: linear-gradient(180deg, #1b1b1b, #101010);
              border: 1px solid #222;
              padding: 18px;
              border-radius: 14px;
          `,
        className,
      )}
    >
      <div
        className={dynatic`
            font-size: 28px;
            font-weight: 600;
        `}
      >
        {mainTitle}
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            color: #ff4d6d;
          `,
          isLarge
            ? dynatic`
                font-size: 14px;
                margin-bottom: 12px;
              `
            : dynatic`
                font-size: 13px;
                letter-spacing: 1;  
              `,
        )}
      >
        {subTitle}
      </div>
      <div
        className={
          isLarge
            ? dynatic`
                font-size: 15px;
                line-height: 1.6;
                color: #ccc;
              `
            : dynatic`
                font-size: 14px;
                line-height: 1.5;
                color: #ddd;
              `
        }
      >
        {children}
      </div>
    </Card>
  );
};
