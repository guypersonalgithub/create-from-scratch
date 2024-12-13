import type { Meta, StoryObj } from "@storybook/react";
import { VirtualList } from "@packages/virtual-list";

const meta = {
  title: "VirtualList",
  component: VirtualList,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];

export const Primary: Story = {
  args: {
    children: mockOptions.map((option) => {
      return <div key={option.value}>{option.label}</div>;
    }),
    itemHeight: 40,
    containerHeight: 150,
  },
  render: (args) => {
    return <VirtualList {...args} />;
  },
};
