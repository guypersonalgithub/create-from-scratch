import type { Meta } from "@storybook/react";
import { Range } from "@packages/range";
import { useState } from "react";

const meta = {
  title: "Range",
  component: Range,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Range>;

export default meta;

export const Primary = {
  render: () => {
    const [value, setValue] = useState(46);

    return <Range min={0} max={100} value={value} onChange={setValue} />;
  },
};
