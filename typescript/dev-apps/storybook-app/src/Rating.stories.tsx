import type { Meta, StoryObj } from "@storybook/react";
import { Rating } from "@packages/rating";

const meta = {
  title: "Rating",
  component: Rating,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  render: (args) => <Rating {...args} />,
};
