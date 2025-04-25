import type { Meta, StoryObj } from "@storybook/react";
import { TabKey } from "@packages/keyboard-key";

const meta = {
  title: "TabKey",
  component: TabKey,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof TabKey>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standbard: Story = {
  render: () => {
    return <TabKey />;
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
  render: (args) => {
    return <TabKey {...args} />;
  },
};
