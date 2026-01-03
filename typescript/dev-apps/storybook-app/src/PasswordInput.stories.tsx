import type { Meta } from "@storybook/react";
import { PasswordInput } from "@packages/password-input";
import { useState } from "react";

const meta = {
  title: "PasswordInput",
  component: PasswordInput,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;

export const Primary = {
  render: () => {
    const [value, setValue] = useState("");

    return <PasswordInput value={value} onChange={setValue} />;
  },
};
