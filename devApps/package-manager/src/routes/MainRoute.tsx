import { Table } from "@packages/table";
import { Tooltip } from "@packages/tooltip";

export const MainRoute = () => {
  return (
    <Table
      rowContainer={{
        height: "500px",
      }}
      columns={[
        {
          header: "name",
          cell: (data) => {
            return (
              <Tooltip offset={-10} content={data.name}>
                <div>{data.name}</div>
              </Tooltip>
            );
          },
          size: 50,
        },
        {
          header: "version",
          cell: (data) => {
            return <div>{data.version}</div>;
          },
          size: 100,
        },
      ]}
      data={[
        {
          name: "test",
          version: "123",
        },
        {
          name: "test2",
          version: "1234dfsfdsfds",
        },
        {
          name: "test2",
          version: "1234dfsfdsfds",
        },
        {
          name: "test2",
          version: "1234dfsfdsfds",
        },
        {
          name: "test2",
          version: "1234dfsfdsfds",
        },
        {
          name: "test2",
          version: "1234dfsfdsfds",
        },
      ]}
    />
  );
};
