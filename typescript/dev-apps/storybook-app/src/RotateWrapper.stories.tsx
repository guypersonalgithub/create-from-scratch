import type { Meta } from "@storybook/react";
import { RotateWrapper, type RotateRef } from "@packages/rotate-wrapper";
import { useRef, useEffect } from "react";
import { Button } from "@packages/button";
import { SixSidedDiceRoll } from "@packages/dice-roll";

const meta = {
  title: "RotateWrapper",
  component: RotateWrapper,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof RotateWrapper>;

export default meta;

export const Primary = {
  render: () => {
    const ref = useRef<RotateRef>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        ref.current.rotate();
    }, []);

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
          <RotateWrapper
            rotateRef={ref}
            rotateX={{ start: "30deg", end: "30deg" }}
            rotateY={{ start: "0", end: "360deg" }}
            rotateZ={{ start: "30deg", end: "30deg" }}
            infiniteRotation
            animationDuration={5000}
          >
            <SixSidedDiceRoll />
          </RotateWrapper>
        </div>
        <Button onClick={() => ref.current?.rotate()} style={{ width: "fit-content" }}>
          Flip
        </Button>
      </div>
    );
  },
};
