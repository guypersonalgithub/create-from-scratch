import type { Meta } from "@storybook/react";
import { ToggleAttempt } from "@packages/toggle";

const meta = {
  title: "ToggleAttempt",
  component: ToggleAttempt,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ToggleAttempt>;

export default meta;

export const Primary = {
  args: {},
  render: () => {
    return <ToggleAttempt options={["test", "test2"]} />;
  },
};
