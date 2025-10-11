import type { Meta, StoryObj } from "@storybook/react";
import { CoinFlip, type CoinFlipRef } from "@packages/coin-flip";
import { useRef } from "react";
import { Button } from "@packages/button";

const meta = {
  title: "CoinFlip",
  component: CoinFlip,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CoinFlip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => {
    const ref = useRef<CoinFlipRef>(null);

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "500px",
          }}
        >
          <CoinFlip {...args} coinRef={ref} />
        </div>
        <Button onClick={() => ref.current?.flip()} style={{ width: "fit-content" }}>
          Flip
        </Button>
      </div>
    );
  },
};
