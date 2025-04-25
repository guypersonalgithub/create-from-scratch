import type { Meta, StoryObj } from "@storybook/react";
import { EnterKey } from "@packages/keyboard-key";

const meta = {
  title: "EnterKey",
  component: EnterKey,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof EnterKey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standbard: Story = {
  render: () => {
    return <EnterKey />;
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
  render: (args) => {
    return <EnterKey {...args} />;
  },
};
