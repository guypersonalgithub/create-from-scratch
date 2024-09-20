import { CSSProperties, ReactNode } from "react";
import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { Pagination, PaginationProps } from "@packages/pagination";
import { getDisplayedRows } from "./utils";

type Column<T> = {
  header: (() => ReactNode) | ReactNode;
  cell: (data: T, index: number) => ReactNode;
  staticColumn?: boolean;
} & (Size | ClassName);

type TableProps<T> = {
  data?: T[];
  requestData?: {
    isLoading: boolean;
    isError: boolean;
    amountOfRows?: number;
  };
  onRowClick?: (data: T) => void;
  columns: Column<T>[];
  rows?: {
    headerRow?: Size | ClassName;
    dataRow?: Size | ClassName;
  };
  columnGap?: number;
  headerContainer?: CSSProperties;
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
  onRowClick,
  columns,
  rows,
  columnGap,
  headerContainer = {},
  rowContainer = {},
  pagination,
}: TableProps<T>) => {
  const { headerRow, dataRow } = rows ?? {};
  const { rowsPerPage, paginationProps } = pagination ?? {};
  const { amountOfRows } = requestData ?? {};
  const totalAmountOfRows = amountOfRows ?? data.length;
  const displayedDataRows = getDisplayedRows({
    rowsPerPage,
    currentPage: paginationProps?.currentPage,
    amountOfRows: totalAmountOfRows,
    data,
  });
  const totalPages = rowsPerPage ? Math.ceil(totalAmountOfRows / rowsPerPage) : 0;

  return (
    <div>
      <div style={{ width: "100%", overflow: "auto" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: "fit-content",
              width: "100%",
              height: headerRow?.size ? `${headerRow.size}px` : undefined,
              gap: columnGap ? `${columnGap}px` : undefined,
              ...headerContainer,
            }}
            className={headerRow?.className}
          >
            {columns.map((column, index) => {
              const { className, size, staticColumn } = column;
              const columnProperties = { className, size, staticColumn } as Column<T>;

              return (
                <TableHeader key={index} {...columnProperties}>
                  {typeof column.header === "function" ? column.header() : column.header}
                </TableHeader>
              );
            })}
          </div>
        </div>
        <div style={rowContainer}>
          {displayedDataRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: "fit-content",
                width: "100%",
                height: dataRow?.size ? `${dataRow.size}px` : undefined,
                gap: columnGap ? `${columnGap}px` : undefined,
                cursor: onRowClick ? "pointer" : undefined,
              }}
              onClick={() => onRowClick?.(row)}
              className={dataRow?.className}
            >
              {columns.map((column, colIndex) => {
                const { className, size, staticColumn } = column;
                const columnProperties = { className, size, staticColumn } as Column<T>;

                return (
                  <TableCell
                    key={colIndex}
                    row={row}
                    rowIndex={rowIndex}
                    index={colIndex}
                    {...columnProperties}
                  >
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
