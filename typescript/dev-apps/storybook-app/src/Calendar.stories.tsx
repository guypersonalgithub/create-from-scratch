import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@packages/calendar";

const meta = {
  title: "Calendar",
  component: Calendar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    format: "range",
    monthStartOnDay: "Sunday",
    containerStyle: { width: "fit-content", height: "fit-content" },
  },
  render: (args) => {
    return <Calendar {...args} />;
  },
};
