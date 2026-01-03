import type { Meta, StoryObj } from "@storybook/react";
import { SimplifiedInefficientAnimatedCounter } from "@packages/animated-counter";

const meta = {
  title: "SimplifiedInefficientAnimatedCounter",
  component: SimplifiedInefficientAnimatedCounter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SimplifiedInefficientAnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    from: 0,
    to: 132,
  },
  render: (args) => {
    return <SimplifiedInefficientAnimatedCounter {...args} />;
  },
};

export const decrease: Story = {
  args: {
    from: 132,
    to: 0,
  },
  render: (args) => {
    return <SimplifiedInefficientAnimatedCounter {...args} />;
  },
};
