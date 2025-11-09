import { type ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { Question } from "./Question";
import { type Reorder } from "./types";
import { dynatic } from "@packages/dynatic-css";

type LoadImageArgs = {
  src: string;
};

const loadImage = async ({ src }: LoadImageArgs) => {
  const path = `./images/test5${src}.png`;
  const image = await import(/* @vite-ignore */ path);

  return image.default;
};

type GetAppropriateLetterArgs = {
  index: number;
};

const getAppropriateLetter = ({ index }: GetAppropriateLetterArgs) => {
  return String.fromCharCode(96 + index);
};

const length = 20;

export const TestAnswersShuffler = () => {
  const [questions, setQuestions] = useState<{ question: ReactNode; options: ReactNode[] }[]>([]);

  useEffect(() => {
    const arrangeQuestions = async () => {
      const questions = await Promise.all(
        Array.from({ length }).map(async (_, index) => {
          const questionNumber = index + 1;
          const imgsrc = `/${questionNumber}`;
          const image = await loadImage({ src: imgsrc });

          return {
            question: <img src={image} />,
            options: await Promise.all(
              Array.from({ length: 5 }).map(async (_, index) => {
                const optionNumber = index + 1;
                const letter = getAppropriateLetter({ index: optionNumber });
                const optionimgsrc = `${imgsrc}${letter}`;
                const image = await loadImage({ src: optionimgsrc });

                return <img src={image} />;
              }),
            ),
          };
        }),
      );

      setQuestions(questions);
    };

    arrangeQuestions();
  }, []);

  const refs = useRef<Array<RefObject<Reorder | null>>>(
    Array.from({ length }).map(() => ({ current: null })),
  );

  return (
    <div
      className={dynatic`
        display: grid;
        gap: 8px;
      `}
    >
      {questions.map((question, index) => {
        return (
          <Question key={index} index={index + 1} callbackRef={refs.current[index]} {...question} />
        );
      })}
      <button
        onClick={() => {
          refs.current.forEach((ref) => ref.current?.());
        }}
      >
        Reshuffle
      </button>
    </div>
  );
};
