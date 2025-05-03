import { Table } from "@packages/table";
import { EllipsisTooltip, Tooltip } from "@packages/tooltip";
import { Badge } from "@packages/badge";
import { ExclamationMark, QuestionMark } from "@packages/icons";

type APITableRow = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  isMandatory?: boolean;
};

type APITableProps = {
  data: APITableRow[];
};

export const APITable = ({ data }: APITableProps) => {
  return (
    <Table
      rowContainer={{ display: "flex", flexDirection: "column", gap: "8px" }}
      columns={[
        {
          header: "Name",
          cell: (data) => {
            const { name } = data;

            return <EllipsisTooltip content={name}>{name}</EllipsisTooltip>;
          },
          size: 250,
        },
        {
          header: "Type",
          cell: (data) => {
            const { type, isMandatory } = data;

            return (
              <Badge style={{ gap: "6px" }} variant="info" size="sm" pill>
                <EllipsisTooltip content={type}>{type}</EllipsisTooltip>
                {isMandatory ? (
                  <Tooltip content="Mandatory property">
                    <ExclamationMark size={24} />
                  </Tooltip>
                ) : (
                  <Tooltip content="Optional property">
                    <QuestionMark size={24} />
                  </Tooltip>
                )}
              </Badge>
            );
          },
          size: 250,
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
          size: 200,
          staticColumn: false,
        },
      ]}
      data={data}
    />
  );
};
