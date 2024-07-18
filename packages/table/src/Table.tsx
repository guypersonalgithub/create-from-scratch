import { CSSProperties, ReactNode } from "react";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";

type Column<T> = {
  header: ReactNode;
  cell: (data: T) => ReactNode;
  staticColumn?: boolean;
} & (Size | ClassName);

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rows?: {
    headerRow?: Size | ClassName;
    dataRow?: Size | ClassName;
  };
  rowContainer?: CSSProperties;
};

type Size = {
  size: number;
  className?: never;
};

type ClassName = {
  size?: never;
  className: string;
};

export const Table = <T extends Record<string, unknown>>({
  data,
  columns,
  rows,
  rowContainer,
}: TableProps<T>) => {
  const { headerRow, dataRow } = rows ?? {};

  return (
    <div style={{ display: "flex", flexFlow: "column", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: headerRow?.size ? `${headerRow.size}px` : undefined,
        }}
        className={headerRow?.className}
      >
        {columns.map((column, index) => {
          const { className, size, staticColumn } = column;
          const columnProperties = { className, size, staticColumn } as Column<T>;

          return (
            <TableHeader key={index} {...columnProperties}>
              {column.header}
            </TableHeader>
          );
        })}
      </div>
      <div style={{ overflow: "scroll", ...rowContainer }}>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: dataRow?.size ? `${dataRow.size}px` : undefined,
            }}
            className={dataRow?.className}
          >
            {columns.map((column, colIndex) => {
              const { className, size, staticColumn } = column;
              const columnProperties = { className, size, staticColumn } as Column<T>;

              return (
                <TableCell key={colIndex} row={row} {...columnProperties}>
                  {column.cell}
                </TableCell>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
