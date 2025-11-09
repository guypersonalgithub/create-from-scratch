import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@packages/badge";

const meta = {
  title: "Badge",
  component: Badge,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Mock",
  },
  render: (args) => {
    return <Badge {...args} />;
  },
};

export const ClickableBadge: Story = {
  args: {
    children: "Mock",
    onClick: () => console.log(""),
  },
  render: (args) => {
    return <Badge {...args} />;
  },
};
