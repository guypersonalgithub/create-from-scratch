import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@packages/avatar";

const meta = {
  title: "Avatar",
  component: Avatar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "John Smith",
  },
  render: (args) => <Avatar {...args} />,
};
