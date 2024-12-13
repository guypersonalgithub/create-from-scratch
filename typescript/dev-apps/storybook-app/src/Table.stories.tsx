import type { Meta } from "@storybook/react";
import { Table } from "@packages/table";

const meta = {
  title: "Table",
  component: Table,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Table>;

export default meta;

export const Primary = {
  render: () => {
    return (
      <Table
        data={[
          { content: "1", content2: "2" },
          { content: "1", content2: "2" },
          { content: "1", content2: "2" },
        ]}
        columns={[
          {
            header: "Header 1",
            cell: (data) => {
              const { content } = data;
              return <div>{content}</div>;
            },
            size: 100,
          },
          {
            header: "Header 2",
            cell: (data) => {
              const { content2 } = data;
              return <div>{content2}</div>;
            },
            size: 100,
          },
        ]}
      />
    );
  },
};
