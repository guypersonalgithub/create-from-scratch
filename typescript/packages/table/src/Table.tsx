import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { Pagination } from "@packages/pagination";
import { getDisplayedRows } from "./utils";
import { type Column, type TableProps } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";

export const Table = <T extends Record<string, unknown>>({
  data = [],
  requestData,
  onRowClick,
  columns,
  rows,
  columnGap,
  containerStyle,
  headerContainer = {},
  rowContainer = {},
  columnStyle,
  dataRowStyle,
  dataRowClass,
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
    <div style={containerStyle}>
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
              alignItems: "stretch",
              minWidth: "fit-content",
              maxWidth: "100%",
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
                <TableHeader
                  key={index}
                  index={index}
                  columnStyle={columnStyle}
                  {...columnProperties}
                >
                  {typeof column.header === "function" ? column.header() : column.header}
                </TableHeader>
              );
            })}
          </div>
        </div>
        <div style={rowContainer}>
          {displayedDataRows.map((row, rowIndex) => {
            const rowStyle = dataRowStyle?.(row, rowIndex) ?? {};

            return (
              <div
                key={rowIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "fit-content",
                  maxWidth: "100%",
                  height: dataRow?.size ? `${dataRow.size}px` : undefined,
                  gap: columnGap ? `${columnGap}px` : undefined,
                  cursor: onRowClick ? "pointer" : undefined,
                  ...rowStyle,
                }}
                onClick={() => onRowClick?.(row)}
                className={combineStringsWithSpaces(
                  dataRow?.className,
                  dataRowClass?.(row, rowIndex),
                )}
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
                      columnStyle={columnStyle}
                      {...columnProperties}
                    >
                      {column.cell}
                    </TableCell>
                  );
                })}
              </div>
            );
          })}
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
