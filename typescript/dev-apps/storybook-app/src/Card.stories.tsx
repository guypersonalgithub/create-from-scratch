import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@packages/card";

const meta = {
  title: "Card",
  component: Card,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Card content",
  },
  render: (args) => {
    return <Card {...args} />;
  },
};
