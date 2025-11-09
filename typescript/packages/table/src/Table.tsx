import { TableHeader } from "./TableHeader";
import { TableCell } from "./TableCell";
import { Pagination } from "@packages/pagination";
import { getDisplayedRows } from "./utils";
import { type Column, type TableProps } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export const Table = <T extends Record<string, unknown>>({
  data = [],
  requestData,
  onRowClick,
  columns,
  rows,
  columnGap,
  containerClassName,
  containerStyle,
  headerContainerClassName,
  headerContainerStyle,
  rowContainerClassName,
  rowContainerStyle,
  columnClassName,
  columnStyle,
  dataRowClassName,
  dataRowStyle,
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
    <div className={containerClassName} style={containerStyle}>
      <div
        className={dynatic`
          width: 100%;
          overflow: auto;
        `}
      >
        <div
          className={dynatic`
            position: sticky;
            top: 0;
            width: 100%;
            z-index: 2;  
          `}
        >
          <div
            className={combineStringsWithSpaces(
              dynatic`
                display: flex;
                align-items: stretch;
                min-width: fit-content;
                max-width: 100%;
              `,
              headerRow?.size &&
                dynatic`
                height: ${headerRow.size}px;
              `,
              columnGap &&
                dynatic`
                gap: ${columnGap}px;
              `,
              headerContainerClassName,
              headerRow?.className,
            )}
            style={headerContainerStyle}
          >
            {columns.map((column, index) => {
              const { className, size, staticColumn } = column;
              const columnProperties = { className, size, staticColumn } as Column<T>;

              return (
                <TableHeader
                  key={index}
                  index={index}
                  columnClassName={columnClassName}
                  columnStyle={columnStyle}
                  {...columnProperties}
                >
                  {typeof column.header === "function" ? column.header() : column.header}
                </TableHeader>
              );
            })}
          </div>
        </div>
        <div className={rowContainerClassName} style={rowContainerStyle}>
          {displayedDataRows.map((row, rowIndex) => {
            const rowStyle = dataRowStyle?.(row, rowIndex) ?? {};

            return (
              <div
                key={rowIndex}
                className={combineStringsWithSpaces(
                  dynatic`
                    display: flex;
                    align-items: center;
                    min-width: fit-content;
                    max-width: 100%;
                  `,
                  dataRow?.size &&
                    dynatic`
                      height: ${dataRow.size}px;
                    `,
                  columnGap &&
                    dynatic`
                      gap: ${columnGap}px;
                    `,
                  onRowClick &&
                    dynatic`
                      cursor: pointer;
                    `,
                  dataRow?.className,
                  dataRowClassName?.(row, rowIndex),
                )}
                style={rowStyle}
                onClick={() => onRowClick?.(row)}
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
                      columnClassName={columnClassName}
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
        <div
          className={dynatic`
            display: flex;
            justify-content: center;
          `}
        >
          <Pagination {...paginationProps} totalPages={totalPages} />
        </div>
      ) : null}
    </div>
  );
};
