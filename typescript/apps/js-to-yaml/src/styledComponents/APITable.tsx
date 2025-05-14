import { Table } from "@packages/table";
import { EllipsisTooltip, Tooltip } from "@packages/tooltip";
import { Badge } from "@packages/badge";
import { ExclamationCircle, QuestionCircle } from "@packages/icons";
import { useUITheme } from "../UIThemes";

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
  const { currentTheme } = useUITheme();
  const isLight = currentTheme === "light";

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
              <Badge
                style={{ gap: "4px", height: undefined }}
                variant={isLight ? "info" : "success"}
                size="sm"
              >
                {isMandatory ? (
                  <Tooltip content="Mandatory property" style={{ display: "flex" }}>
                    <ExclamationCircle size={14} />
                  </Tooltip>
                ) : (
                  <Tooltip content="Optional property" style={{ display: "flex" }}>
                    <QuestionCircle size={14} />
                  </Tooltip>
                )}
                <EllipsisTooltip content={type}>{type}</EllipsisTooltip>
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
