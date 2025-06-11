import type { Meta, StoryObj } from "@storybook/react";
import { RollingCounter } from "@packages/rolling-counter";

const meta = {
  title: "RollingCounter",
  component: RollingCounter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RollingCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    from: 0,
    to: 98765,
    duration: 100
  },
  render: (args) => {
    return <RollingCounter {...args} />;
  },
};
