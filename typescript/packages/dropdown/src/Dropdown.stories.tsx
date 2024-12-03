import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "./Dropdown";

const meta = {
  title: "Dropdown",
  component: Dropdown,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];

export const Primary: Story = {
  args: {
    options: mockOptions,
    callback: (picked) => console.log(picked.label),
  },
  render: (args) => {
    return <Dropdown {...args} />;
  },
};
