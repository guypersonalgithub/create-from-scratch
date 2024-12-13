import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@packages/input";

const meta = {
  title: "Input",
  component: Input,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: (args) => {
    return <Input {...args} />;
  },
};
