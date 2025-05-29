import type { Meta, StoryObj } from "@storybook/react";
import { DragAndDrop } from "@packages/drag-and-drop";

const meta = {
  title: "DragAndDrop",
  component: DragAndDrop,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DragAndDrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    groups: [
      {
        id: "a",
        title: <h3>Drag to Reorder</h3>,
      },
      {
        id: "b",
        title: <h3>Drag to Reorder</h3>,
      },
    ],
    items: [
      { id: "1", label: "Item A", container: "a" },
      { id: "2", label: "Item B", container: "a" },
      { id: "3", label: "Item C", container: "a" },
      { id: "4", label: "Item D", container: "a" },
      { id: "5", label: "Item CS", container: "b" },
      { id: "6", label: "Item DE", container: "b" },
    ],
  },
  render: (args) => {
    return <DragAndDrop {...args} />;
  },
};
