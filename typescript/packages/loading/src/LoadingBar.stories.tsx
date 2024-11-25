import type { Meta, StoryObj } from "@storybook/react";
import { LoadingBar } from "./LoadingBar";

const meta = {
  title: "LoadingBar",
  component: LoadingBar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoadingBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    backgroundColor: "red",
    color: "lightblue",
  },
  render: (args) => {
    return <LoadingBar {...args} />;
  },
};
