import type { Meta, StoryObj } from "@storybook/react";
import { TreeExplorer } from "@packages/tree-explorer";

const meta = {
  title: "TreeExplorer",
  component: TreeExplorer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TreeExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: [
      {
        id: "1",
        label: "Root",
        children: [
          { id: "2", label: "Child 1", children: [{ id: "3", label: "Grandchild" }] },
          { id: "4", label: "Child 2" },
        ],
      },
    ],
  },
  render: (args) => {
    return <TreeExplorer {...args} />;
  },
};
