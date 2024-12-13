import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@packages/loading";

const meta = {
  title: "Skeleton",
  component: Skeleton,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    backgroundColor: "red",
  },
  render: (args) => {
    return <Skeleton {...args} />;
  },
};
