import { ReactNode } from "react";

type TableCellProps<T> = {
  row: T;
  children: (row: T, rowIndex: number, columnIndex: number) => ReactNode;
  staticColumn?: boolean;
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
  rowIndex,
  index,
}: TableCellProps<T>) => {
  return (
    <div
      className={className}
      style={{
        textAlign: "left",
        height: "inherit",
        flexGrow: staticColumn ? 0 : 1,
        whiteSpace: "nowrap",
        ...(size ? { width: `${size}px` } : {}),
      }}
    >
      {children(row, rowIndex, index)}
    </div>
  );
};
