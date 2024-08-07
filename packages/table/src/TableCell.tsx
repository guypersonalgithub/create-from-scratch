import { ReactNode } from "react";

type TableCellProps<T> = {
  row: T;
  children: (row: T) => ReactNode;
  staticColumn?: boolean;
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
}: TableCellProps<T>) => {
  return (
    <div
      className={className}
      style={{
        textAlign: "left",
        height: "inherit",
        flexGrow: staticColumn ? 0 : 1,
        ...(size ? { width: `${size}px` } : {}),
      }}
    >
      {children(row)}
    </div>
  );
};
