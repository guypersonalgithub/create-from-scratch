import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties, type ReactNode } from "react";

type TableHeaderProps = {
  children: ReactNode;
  staticColumn?: boolean;
  columnClassName?: (index: number) => string | undefined;
  columnStyle?: (index: number) => CSSProperties | undefined;
  index: number;
} & (Size | ClassName);

type Size = {
  size: number;
  className?: never;
};

type ClassName = {
  size?: never;
  className: string;
};

export const TableHeader = ({
  children,
  staticColumn = true,
  columnClassName,
  columnStyle,
  index,
  className,
  size,
}: TableHeaderProps) => {
  const style = columnStyle?.(index) ?? {};

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          align-items: center;
          text-align: left;
          white-space: nowrap;
        `,
        staticColumn
          ? dynatic`
              flex-grow: 0;
            `
          : dynatic`
              flex-grow: 1;
            `,
        size &&
          dynatic`
            width: ${size}px;
          `,
        columnClassName?.(index),
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
