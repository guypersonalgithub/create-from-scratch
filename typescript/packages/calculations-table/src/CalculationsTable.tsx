import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { CSSProperties } from "react";

type CalculationsTableProps<T extends string> = {
  columns: T[];
  data: Array<Record<T, number | string>>;
  headerContainerStyle?: CSSProperties;
};

export const CalculationsTable = <T extends string>({
  columns,
  data,
  headerContainerStyle = {},
}: CalculationsTableProps<T>) => {
  return (
    <Table
      containerStyle={{ width: "fit-content" }}
      headerContainer={{
        backgroundColor: "#242424",
        borderBottom: "1px solid #383232",
        paddingLeft: "10px",
        paddingRight: "10px",
        ...headerContainerStyle,
      }}
      rowContainer={{
        height: "100%",
      }}
      rows={{
        dataRow: {
          size: 35,
        },
      }}
      dataRowStyle={() => {
        return {
          paddingLeft: "10px",
          paddingRight: "10px",
        };
      }}
      columnStyle={(index) => {
        if (index === 0) {
          return;
        }

        return {
          borderLeft: "1px solid #383232",
          paddingLeft: "10px",
        };
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
