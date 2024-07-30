import { CSSProperties, ReactNode } from "react";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { Pagination, PaginationProps } from "@packages/pagination";
import { calculateCurrentDisplayedRowIndexes } from "./utils";

type Column<T> = {
  header: ReactNode;
  cell: (data: T) => ReactNode;
  staticColumn?: boolean;
} & (Size | ClassName);

type TableProps<T> = {
  data?: T[];
  requestData?: {
    isLoading: boolean;
    isError: boolean;
    amountOfRows?: number;
  };
  columns: Column<T>[];
  rows?: {
    headerRow?: Size | ClassName;
    dataRow?: Size | ClassName;
  };
  rowContainer?: CSSProperties;
  pagination?: {
    paginationProps: Omit<PaginationProps, "totalPages">;
    rowsPerPage: number;
  };
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
  data = [],
  requestData,
  columns,
  rows,
  rowContainer,
  pagination,
}: TableProps<T>) => {
  const { headerRow, dataRow } = rows ?? {};
  const { rowsPerPage, paginationProps } = pagination ?? {};
  const { amountOfRows } = requestData ?? {};
  const totalAmountOfRows = amountOfRows ?? data.length;
  const { startingIndex, endingIndex } = calculateCurrentDisplayedRowIndexes({
    rowsPerPage,
    currentPage: paginationProps?.currentPage,
    amountOfRows: totalAmountOfRows,
  });
  const displayedDataRows = data.slice(startingIndex, endingIndex);
  const totalPages = rowsPerPage ? Math.ceil(totalAmountOfRows / rowsPerPage) : 0;

  return (
    <div>
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
        <div style={{ overflow: "auto", ...rowContainer }}>
          {displayedDataRows.map((row, rowIndex) => (
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
      {paginationProps ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination {...paginationProps} totalPages={totalPages} />
        </div>
      ) : null}
    </div>
  );
};
