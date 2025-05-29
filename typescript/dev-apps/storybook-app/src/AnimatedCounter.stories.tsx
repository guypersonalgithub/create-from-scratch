import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedCounter } from "@packages/animated-counter";

const meta = {
  title: "AnimatedCounter",
  component: AnimatedCounter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Increase: Story = {
  args: {
    from: 0,
    to: 1231231,
  },
  render: (args) => {
    return <AnimatedCounter {...args} />;
  },
};

export const decrease: Story = {
  args: {
    from: 1231231,
    to: 0,
  },
  render: (args) => {
    return <AnimatedCounter {...args} />;
  },
};
