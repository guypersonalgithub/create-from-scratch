import { CSSProperties, ReactNode } from "react";

type TableCellProps<T> = {
  row: T;
  children: (row: T, rowIndex: number, columnIndex: number) => ReactNode;
  staticColumn?: boolean;
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
  columnStyle,
  rowIndex,
  index,
}: TableCellProps<T>) => {
  const style = columnStyle?.(index) ?? {};

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        textAlign: "left",
        height: "inherit",
        flexGrow: staticColumn ? 0 : 1,
        whiteSpace: "nowrap",
        ...(size ? { width: `${size}px` } : {}),
        ...style,
      }}
    >
      {children(row, rowIndex, index)}
    </div>
  );
};
