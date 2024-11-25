import type { Meta } from "@storybook/react";
import { Tabs } from "./Tabs";
import { useState } from "react";

const meta = {
  title: "Tabs",
  component: Tabs,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Tabs>;

export default meta;

export const Primary = {
  render: () => {
    const [selected, setSelected] = useState("all");

    return (
      <Tabs
        tabs={
          [
            { label: "All", value: "all" },
            { label: "External", value: "external" },
            { label: "Local", value: "local" },
            { label: "Up to date", value: "up-to-date" },
            { label: "Outdated", value: "outdated" },
          ] as const
        }
        selected={selected}
        onClick={(tab) => setSelected(tab)}
      />
    );
  },
};
