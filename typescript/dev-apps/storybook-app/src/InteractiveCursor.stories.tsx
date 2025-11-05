import type { Meta, StoryObj } from "@storybook/react";
import {
  InteractiveCursorManager,
  useControlInteractiveCursor,
} from "@packages/interactive-cursor";
import { Button } from "@packages/button";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "InteractiveCursor",
  component: InteractiveCursorManager,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof InteractiveCursorManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const { enableInteractiveCursor, disableInteractiveCursor, updateClassNamesOrStyle } =
      useControlInteractiveCursor();

    return (
      <>
        <Button onClick={enableInteractiveCursor}>Enable</Button>
        <Button onClick={disableInteractiveCursor}>Disable</Button>
        <Button
          className={dynatic`
            cursor: none;
          `}
          onMouseEnter={() => {
            updateClassNamesOrStyle({
              className: dynatic`
              width: 40px;
              height: 40px;
            `,
            });
          }}
          onMouseLeave={() => updateClassNamesOrStyle({ className: undefined })}
        >
          Test
        </Button>
        <InteractiveCursorManager />
      </>
    );
  },
};
