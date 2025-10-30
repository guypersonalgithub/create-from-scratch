import { Button } from "@packages/button";
import { ArrowRight2 } from "@packages/icons";
import { type CSSProperties, type ReactNode } from "react";
import { dynatic } from "../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/string-utils";

type Variants = "blue" | "green" | "ghost";

type GetVariant = {
  variant: Variants;
};

const getVariant = ({ variant }: GetVariant) => {
  if (variant === "blue") {
    return dynatic`
      background-color: ${(config) => config.shared.lightBlue};
      color: ${(config) => config.shared.white};
      border: 2px solid ${(config) => config.shared.lightBlue};

      &:hover {
        background-color: ${(config) => config.shared.darkerLightBlue};
        border: 2px solid ${(config) => config.shared.darkerLightBlue};
      }
    `;
  }

  if (variant === "green") {
    return dynatic`
      background-color: ${(config) => config.shared.lightGreen};
      color: ${(config) => config.shared.white};
      border: 2px solid ${(config) => config.shared.lightGreen};

      &:hover {
        background-color: ${(config) => config.shared.darkerLightGreen};
        border: 2px solid ${(config) => config.shared.darkerLightGreen};
      }
    `;
  }

  return dynatic`
    background-color: ${(config) => config.colors.mainBG};
    color: ${(config) => config.colors.mainColor};
    transition: ${(config) => config.shared.defaultTransition};
    border: 2px solid ${(config) => config.colors.defaultBorder};

    &:hover {
      background-color: ${(config) => config.colors.secondaryBG};
    }
  `;
};

type StyledButtonProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  children: ReactNode;
  addArrow?: boolean;
  variant?: Variants;
};

export const StyledButton = ({
  className,
  style,
  onClick,
  children,
  addArrow,
  variant = "blue",
}: StyledButtonProps) => {
  return (
    <Button
      className={combineStringsWithSpaces(
        dynatic`
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          position: relative;
          height: fit-content;
          width: fit-content;
          white-space: nowrap;
        `,
        getVariant({ variant }),
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {children}
      {addArrow ? (
        <ArrowRight2
          className={dynatic`
            width: 16px;
            height: 16px;
          `}
        />
      ) : null}
    </Button>
  );
};
