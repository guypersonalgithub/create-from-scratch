import type { Meta, StoryObj } from "@storybook/react";
import { RollingCounter } from "@packages/animated-counter";

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
    to: 1231231,
  },
  render: (args) => {
    return <RollingCounter to={98765} duration={3000} />;
  },
};
