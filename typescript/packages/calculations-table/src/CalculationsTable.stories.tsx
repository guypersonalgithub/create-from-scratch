import type { Meta, StoryObj } from "@storybook/react";
import { CalculationsTable } from "./CalculationsTable";

const meta = {
  title: "CalculationsTable",
  component: CalculationsTable,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CalculationsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    columns: ["x", "fx"],
    data: [
      { x: 2, fx: 2.24 },
      { x: 1.5, fx: 2.12 },
      { x: 1.1, fx: 2.02 },
      { x: 1.01, fx: 2.002 },
    ],
  },
  render: (args) => {
    return <CalculationsTable {...args} />;
  },
};
