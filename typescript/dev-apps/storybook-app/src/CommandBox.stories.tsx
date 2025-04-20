import type { Meta, StoryObj } from "@storybook/react";
import { CommandBox } from "@packages/command-box";
import { CopyToClipboard } from "@packages/copy-to-clipboard";

const meta = {
  title: "CommandBox",
  component: CommandBox,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CommandBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    command: "CommandBox content",
  },
  render: (args) => {
    return <CommandBox {...args} />;
  },
};

export const CommandBoxWithClipboard: Story = {
  args: {
    command: "CommandBox content",
    copyToClipboard: true,
  },
  render: (args) => {
    return <CommandBox {...args} />;
  },
};

export const CommandBoxWithClipboardAndIcons: Story = {
  args: {
    command: "CommandBox content",
    copyToClipboard: true,
    withIcons: true,
  },
  render: (args) => {
    return <CommandBox {...args} />;
  },
};
