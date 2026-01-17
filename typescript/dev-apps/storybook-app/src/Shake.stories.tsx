import type { Meta, StoryObj } from "@storybook/react";
import { Shake } from "@packages/shake";

const meta = {
  title: "Shake",
  component: Shake,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Shake>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    distance: 5,
    children: "Test",
  },
  render: (args) => {
    return <Shake {...args} />;
  },
};
