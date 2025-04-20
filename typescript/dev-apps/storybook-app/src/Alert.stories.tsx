import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@packages/alert";
import { useState } from "react";

const meta = {
  title: "Alert",
  component: Alert,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: "Mock Alert",
    type: "success",
  },
  render: (args) => {
    return <Alert {...args} />;
  },
};

export const Error: Story = {
  args: {
    message: "Mock Alert",
    type: "error",
  },
  render: (args) => {
    return <Alert {...args} />;
  },
};

export const Warning: Story = {
  args: {
    message: "Mock Alert",
    type: "warning",
  },
  render: (args) => {
    return <Alert {...args} />;
  },
};

export const Info: Story = {
  args: {
    message: "Mock Alert",
    type: "info",
  },
  render: (args) => {
    return <Alert {...args} />;
  },
};

export const WithClose: Story = {
  args: {
    message: "Mock Alert",
    type: "success",
  },
  render: (args) => {
    const [displayAlert, setDisplayAlert] = useState(true);

    if (!displayAlert) {
      return <></>;
    }

    return <Alert {...args} onClose={() => setDisplayAlert(false)} />;
  },
};
