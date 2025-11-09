import { type MutableRefObject, type ReactNode } from "react";
import { useReorderOptions } from "./useReorderOptions";
import { dynatic } from "@packages/dynatic-css";

type QuestionProps = {
  index: number;
  question: ReactNode;
  options: ReactNode[];
  callbackRef: MutableRefObject<(() => void) | null>;
};

export const Question = ({ index, question, options, callbackRef }: QuestionProps) => {
  const { currentOptions, reorder } = useReorderOptions({
    options,
  });

  callbackRef.current = reorder;

  return (
    <div
      className={dynatic`
        text-align: right;
        font-size: 12px;
        display: grid;
        gap: 4px;
      `}
    >
      <div
        className={dynatic`
          font-weight: bold;
          display: flex;
        `}
      >
        <div>{index}.</div>
        <div>{question}</div>
      </div>
      {currentOptions.map((option, index) => {
        return (
          <div
            key={index}
            className={dynatic`
              display: flex;
              gap: 4px;
            `}
          >
            <div>{index + 1}.</div>
            <div>{option}</div>
          </div>
        );
      })}
    </div>
  );
};
