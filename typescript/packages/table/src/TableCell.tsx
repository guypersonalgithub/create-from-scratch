import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties, type ReactNode } from "react";

type TableCellProps<T> = {
  row: T;
  children: (row: T, rowIndex: number, columnIndex: number) => ReactNode;
  staticColumn?: boolean;
  columnClassName?: (index: number) => string | undefined;
  columnStyle?: (index: number) => CSSProperties | undefined;
  rowIndex: number;
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

export const TableCell = <T,>({
  row,
  children,
  staticColumn = true,
  className,
  size,
  columnClassName,
  columnStyle,
  rowIndex,
  index,
}: TableCellProps<T>) => {
  const style = columnStyle?.(index) ?? {};

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          align-items: center;
          text-align: left;
          height: inherit;
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
      {children(row, rowIndex, index)}
    </div>
  );
};
