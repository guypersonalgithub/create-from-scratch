import type { Meta, StoryObj } from "@storybook/react";
import { VaryingVirtualList } from "./VaryingVirtualList";

const meta = {
  title: "VaryingVirtualList",
  component: VaryingVirtualList,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof VaryingVirtualList>;

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
    containerHeight: 150,
  },
  render: (args) => {
    return <VaryingVirtualList {...args} />;
  },
};
