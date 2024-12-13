import type { Meta, StoryObj } from "@storybook/react";
import { AutoCompleteInput } from "@packages/auto-complete-input";

const meta = {
  title: "AutoCompleteInput",
  component: AutoCompleteInput,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AutoCompleteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const mock = [
  {
    label: "option1",
    value: "option1",
  },
  {
    label: "option2",
    value: "option2",
  },
  {
    label: "test",
    value: "test",
  },
];

export const Primary: Story = {
  args: {
    autocompleteOptionsCallback: (text) => {
      const lowercaseText = text.toLowerCase();
      return mock.filter((option) => option.label.toLowerCase().includes(lowercaseText));
    },
    callback: (picked) => alert(picked.label),
  },
  render: (args) => {
    return <AutoCompleteInput {...args} />;
  },
};
