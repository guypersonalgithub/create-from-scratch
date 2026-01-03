import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedUnderline } from "@packages/animated-underline";

const meta = {
  title: "AnimatedUnderline",
  component: AnimatedUnderline,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AnimatedUnderline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Test",
  },
  render: (args) => {
    return <AnimatedUnderline {...args} />;
  },
};
