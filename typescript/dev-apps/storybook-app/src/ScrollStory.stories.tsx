import type { Meta } from "@storybook/react";
import { ScrollStory, type SectionData } from "@packages/scroll-story";
import { dynatic } from "@packages/dynatic-css";

const meta = {
  title: "ScrollStory",
  component: ScrollStory,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScrollStory>;

export default meta;

const sections: SectionData[] = [
  {
    id: "1",
    className: dynatic`
      color: white;
      background-color: #f28b82;
      font-size: 32px;
    `,
    content: (
      <div>
        <h2>Introduction</h2>
        <div
          className={dynatic`
            font-size: 20px;
          `}
        >
          Welcome to our story.
        </div>
      </div>
    ),
  },
  {
    id: "2",
    className: dynatic`
      color: white;
      background-color: #fbbc04;
      font-size: 32px;
    `,
    content: (
      <div>
        <h2>Chapter 1</h2>
        <div
          className={dynatic`
            font-size: 20px;
          `}
        >
          The adventure begins.
        </div>
      </div>
    ),
  },
  {
    id: "3",
    className: dynatic`
      color: white;
      background-color: #34a853;
      font-size: 32px;
    `,
    content: (
      <div>
        <h2>Chapter 2</h2>
        <div
          className={dynatic`
            font-size: 20px;
          `}
        >
          Challenges arise.
        </div>
      </div>
    ),
  },
  {
    id: "4",
    className: dynatic`
      color: white;
      background-color: #4285f4;
      font-size: 32px;
    `,
    content: (
      <div>
        <h2>Conclusion</h2>
        <div
          className={dynatic`
            font-size: 20px;
          `}
        >
          A satisfying end.
        </div>
      </div>
    ),
  },
];

export const Primary = {
  render: () => {
    return <ScrollStory sections={sections} />;
  },
};
