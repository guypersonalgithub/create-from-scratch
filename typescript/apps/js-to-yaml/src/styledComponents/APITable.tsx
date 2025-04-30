import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";

type APITableRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

type APITableProps = {
  data: APITableRow[];
};

export const APITable = ({ data }: APITableProps) => {
  return (
    <Table
      columns={[
        {
          header: "Name",
          cell: (data) => {
            const { name } = data;

            return <EllipsisTooltip content={name}>{name}</EllipsisTooltip>;
          },
          size: 150,
          staticColumn: false,
        },
        {
          header: "Type",
          cell: (data) => {
            const { type } = data;

            return <EllipsisTooltip content={type}>{type}</EllipsisTooltip>;
          },
          size: 200,
          // staticColumn: false,
        },
        {
          header: "Default",
          cell: (data) => {
            const { defaultValue = "-" } = data;

            return <EllipsisTooltip content={defaultValue}>{defaultValue}</EllipsisTooltip>;
          },
          size: 70,
        },
        {
          header: "Description",
          cell: (data) => {
            const { description } = data;

            return <EllipsisTooltip content={description}>{description}</EllipsisTooltip>;
          },
          size: 400,
          staticColumn: false,
        },
      ]}
      data={data}
    />
  );
};
