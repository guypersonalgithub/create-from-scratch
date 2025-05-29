import type { Meta, StoryObj } from "@storybook/react";
import { AvatarGroup } from "@packages/avatar";

const meta = {
  title: "AvatarGroup",
  component: AvatarGroup,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    users: [
      { name: "Alice Johnson" },
      { name: "John Smith" },
      { name: "Sara Miles" },
      { name: "Tom Hardy" },
      { name: "Anna White" },
      { name: "Mark Twain" },
    ],
  },
  render: (args) => <AvatarGroup {...args} />,
};
