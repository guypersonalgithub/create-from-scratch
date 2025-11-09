import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";

type CalculationsTableProps<T extends string> = {
  columns: T[];
  data: Array<Record<T, number | string>>;
  headerContainerClassName?: string;
};

export const CalculationsTable = <T extends string>({
  columns,
  data,
  headerContainerClassName,
}: CalculationsTableProps<T>) => {
  return (
    <Table
      containerClassName={dynatic`
        width: fit-content;
      `}
      headerContainerClassName={combineStringsWithSpaces(
        dynatic`
          background-color: #242424;
          border-bottom: 1px solid #383232;
          padding-left: 10px;
          padding-right: 10px;
        `,
        headerContainerClassName,
      )}
      rowContainerClassName={dynatic`
        height: 100%;  
      `}
      rows={{
        dataRow: {
          size: 35,
        },
      }}
      dataRowClassName={() => {
        return dynatic`
          padding-left: 10px;
          padding-right: 10px;
        `;
      }}
      columnClassName={(index) => {
        if (index === 0) {
          return;
        }

        return dynatic`
          border-left: 1px solid #383232;
          padding-left: 10px;
        `;
      }}
      columns={columns.map((column) => {
        return {
          header: column,
          cell: (row: (typeof data)[number]) => {
            const value = row[column as keyof typeof row];

            return <EllipsisTooltip content={value}>{value}</EllipsisTooltip>;
          },
          size: 50,
        };
      })}
      data={data}
      columnGap={10}
    />
  );
};
