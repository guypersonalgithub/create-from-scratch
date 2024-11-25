import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta = {
  title: "Spinner",
  component: Spinner,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    backgroundColor: "red",
  },
  render: (args) => {
    return <Spinner {...args} />;
  },
};
