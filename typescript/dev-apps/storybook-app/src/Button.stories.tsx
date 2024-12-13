import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@packages/button";

const meta = {
  title: "Button",
  component: Button,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onClick: () => alert("Clicked"),
    children: "Test",
  },
  render: (args) => {
    return <Button {...args} />;
  },
};
