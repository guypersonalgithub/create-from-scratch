import type { Meta, StoryObj } from "@storybook/react";
import { Typeahead } from "@packages/typeahead";

const meta = {
  title: "Typeahead",
  component: Typeahead,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Typeahead>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
];

export const Primary: Story = {
  args: {
    options: mockOptions,
    callback: (picked) => alert(picked.label),
  },
  render: (args) => {
    return <Typeahead {...args} />;
  },
};
