import type { Meta, StoryObj } from "@storybook/react";
import { Pulse } from "./Pulse";

const meta = {
  title: "Pulse",
  component: Pulse,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Pulse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RegularPulse: Story = {
  args: { children: "Test" },
  render: (args) => {
    return <Pulse {...args} />;
  },
};

export const CircularPulse: Story = {
  args: {
    children: <div style={{ borderRadius: "100%", width: "50px", height: "50px" }} />,
    pulseColor: "red",
  },
  render: (args) => {
    return <Pulse {...args} />;
  },
};

