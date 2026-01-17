import { ComparisonTable, ComparisonTableProps } from "@packages/comparison-table";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

export const StyledComparisonTable = <T extends Record<string, unknown>>({
  headerContainerClassName,
  columnClassName,
  ...props
}: ComparisonTableProps<T>) => {
  return (
    <ComparisonTable
      headerContainerClassName={combineStringsWithSpaces(
        dynatic`
          background-color: #242424;
          border-bottom: 1px solid #383232;
        `,
        headerContainerClassName,
      )}
      rows={{
        dataRow: {
          size: 50,
        },
      }}
      columnClassName={(index) => {
        return combineStringsWithSpaces(
          dynatic`
            border-left: 1px solid #383232;
          `,
          columnClassName?.(index),
        );
      }}
      {...props}
    />
  );
};
