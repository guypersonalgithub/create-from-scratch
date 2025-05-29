import type { Meta } from "@storybook/react";
import { Shuttle } from "@packages/shuttle";
import { useState } from "react";

const meta = {
  title: "Shuttle",
  component: Shuttle,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Shuttle>;

export default meta;

const allItems = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i + 1}`,
  label: `Item ${i + 1}`,
}));

export const Primary = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div style={{ padding: 20 }}>
        <h2>Custom Shuttle Example</h2>
        <Shuttle items={allItems} selectedIds={selected} onChange={setSelected} />
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </div>
    );
  },
};
