import type { Meta, StoryObj } from "@storybook/react";
import { CoinFlip, type CoinFlipRef } from "@packages/coin-flip";
import { useRef } from "react";
import { Button } from "@packages/button";
import { dynatic } from "@packages/dynatic-css";

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
      <div
        className={dynatic`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <div
          className={dynatic`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 500px;  
          `}
        >
          <CoinFlip {...args} coinRef={ref} />
        </div>
        <Button
          onClick={() => ref.current?.flip()}
          className={dynatic`
            width: fit-content;
          `}
        >
          Flip
        </Button>
      </div>
    );
  },
};
