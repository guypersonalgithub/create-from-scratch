import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Checkbox",
  component: Checkbox,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onChange: (state) => alert(state),
  },
  render: (args) => {
    return <Checkbox {...args} />;
  },
};
