import type { Meta, StoryObj } from "@storybook/react";
import { CounterBadge } from "@packages/badge";

const meta = {
  title: "CounterBadge",
  component: CounterBadge,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CounterBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "5",
    size: 20,
  },
  render: (args) => {
    return <CounterBadge {...args} />;
  },
};
