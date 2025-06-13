import { type MutableRefObject, type ReactNode } from "react";
import { useReorderOptions } from "./useReorderOptions";

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
    <div style={{ textAlign: "right", fontSize: "12px", display: "grid", gap: "4px" }}>
      <div style={{ fontWeight: "bold", display: "flex" }}>
        <div>{index}.</div>
        <div>{question}</div>
      </div>
      {currentOptions.map((option, index) => {
        return (
          <div key={index} style={{ display: "flex", gap: "4px" }}>
            <div>{index + 1}.</div>
            <div>{option}</div>
          </div>
        );
      })}
    </div>
  );
};
