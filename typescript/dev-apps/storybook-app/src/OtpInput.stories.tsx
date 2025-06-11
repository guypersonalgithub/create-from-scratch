import type { Meta, StoryObj } from "@storybook/react";
import { OTPInput } from "@packages/otp-input";
import { useState } from "react";

const meta = {
  title: "OTPInput",
  component: OTPInput,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: "text",
    count: 4,
    callback: () => console.log("???"),
  },
  render: (args) => {
    return <OTPInput {...args} />;
  },
};
