import type { Meta } from "@storybook/react";
import { RadioGroup } from "@packages/radio-button";
import { useState } from "react";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

export const Primary = {
  render: () => {
    const [selectedFrom, setSelectedFrom] = useState("hex");

    return (
      <RadioGroup
        label="Pick an option:"
        options={[
          { label: "HEX", value: "hex" },
          { label: "RGBA", value: "rgba" },
          { label: "HSL", value: "hsl" },
        ]}
        value={selectedFrom}
        onChange={setSelectedFrom}
        labelClassName={dynatic`
          color: black;  
        `}
      />
    );
  },
};
