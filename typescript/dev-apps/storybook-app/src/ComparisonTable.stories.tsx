import type { Meta, StoryObj } from "@storybook/react";
import { ComparisonTable } from "@packages/comparison-table";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "ComparisonTable",
  component: ComparisonTable,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ComparisonTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    headerContainerClassName: dynatic`
        border-bottom: 1px solid #383232;
    `,
    columnClassName: () => dynatic`
        border-left: 1px solid #383232;
    `,
    columns: [
      {
        header: "Test",
        cell: (row) => {
          return <div>{row.test as string}</div>;
        },
        size: 110,
      },
      {
        header: "Test2",
        cell: (row) => {
          return <div>{row.test2 as string}</div>;
        },
        size: 110,
      },
      {
        header: "Test3",
        cell: (row) => {
          return <div>{row.test3 as string}</div>;
        },
        size: 110,
      },
    ],
    data: [
      { test: "1", test2: "2", test3: "3" },
      {
        test: "4",
        test2: "5",
        test3: "6",
      },
      {
        test: "7",
        test2: "8",
        test3: "9",
      },
    ],
  },

  render: (args) => {
    return <ComparisonTable {...args} />;
  },
};
