import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";

export const Limit = () => {
  return (
    <div>
      <Table
        containerStyle={{ width: "fit-content" }}
        headerContainer={{
          backgroundColor: "#242424",
          borderBottom: "1px solid #383232",
          paddingLeft: "10px",
          paddingRight: "10px",
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
        columns={[
          {
            header: "x",
            cell: (data) => {
              const value = data.x;

              return <EllipsisTooltip content={value}>{value}</EllipsisTooltip>;
            },
            size: 50,
          },
          {
            header: "f(x)",
            cell: (data) => {
              const value = data.fx;

              return <EllipsisTooltip content={value}>{value}</EllipsisTooltip>;
            },
            size: 50,
          },
        ]}
        data={[
          {
            x: 1,
            fx: 1,
          },
          {
            x: 2,
            fx: 2,
          },
        ]}
        columnGap={10}
      />
    </div>
  );
};
