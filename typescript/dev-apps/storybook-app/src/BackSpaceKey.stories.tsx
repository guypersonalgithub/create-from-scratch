import type { Meta, StoryObj } from "@storybook/react";
import { Backspace } from "@packages/keyboard-key";

const meta = {
  title: "Backspace",
  component: Backspace,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Backspace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standbard: Story = {
  render: () => {
    return <Backspace />;
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
  render: (args) => {
    return <Backspace {...args} />;
  },
};
