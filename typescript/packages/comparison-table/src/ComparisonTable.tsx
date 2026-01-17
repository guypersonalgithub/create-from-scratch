import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { Table } from "@packages/table";
import type { ComparisonTableProps } from "./types";

export const ComparisonTable = <T extends Record<string, unknown>>({
  containerClassName,
  headerContainerClassName,
  dataRowClassName,
  columnClassName,
  ...rest
}: ComparisonTableProps<T>) => {
  return (
    <Table
      containerClassName={combineStringsWithSpaces(
        dynatic`
          width: fit-content;
        `,
        containerClassName,
      )}
      headerContainerClassName={combineStringsWithSpaces(
        dynatic`
          padding-left: 10px;
          padding-right: 10px;
        `,
        headerContainerClassName,
      )}
      dataRowClassName={(data, index) => {
        return combineStringsWithSpaces(
          dynatic`
            padding-left: 10px;
            padding-right: 10px;
          `,
          dataRowClassName?.(data as T, index),
        );
      }}
      columnClassName={(index) => {
        if (index === 0) {
          return;
        }

        return combineStringsWithSpaces(
          dynatic`
            padding-left: 10px;
          `,
          columnClassName?.(index),
        );
      }}
      {...rest}
    />
  );
};
