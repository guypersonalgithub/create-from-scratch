import type { Meta, StoryObj } from "@storybook/react";
import { Timer } from "@packages/timer";

const meta = {
  title: "Timer",
  component: Timer,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    milliseconds: 60000,
  },
  render: (args) => <Timer {...args} />,
};
