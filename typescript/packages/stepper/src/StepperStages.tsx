import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { Button } from "@packages/button";
import type { StepperStagesProps } from "./types";
import { ProgressBar } from "@packages/progress-bar";

export const StepperStages = ({
  steps,
  stepClassName,
  currentStepClassName,
  currentStep,
  setCurrentStep,
  includeProgressBar,
  progressBarClassName,
  innerProgressbarClassName,
  initiallyAnimated,
}: StepperStagesProps) => {
  return (
    <div
      className={dynatic`
        display: grid;
        align-items: center;
      `}
    >
      <div
        className={dynatic`
        display: flex;
        justify-content: space-between;
        grid-area: 1 / 1;
        z-index: 2;
      `}
      >
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;

          return (
            <Button
              key={`step-${index}`}
              className={dynatic`
                display: flex;
                flex-direction: column;
                border: none;
                background: none;
                gap: 10px;
            `}
              onClick={() => setCurrentStep(index)}
            >
              <div
                className={combineStringsWithSpaces(
                  dynatic`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `,
                  stepClassName,
                  isCurrent && currentStepClassName,
                )}
              >
                {index + 1}
              </div>
              <div>{step.label}</div>
            </Button>
          );
        })}
      </div>
      <div
        className={dynatic`
            grid-area: 1 / 1;
            pointer-events: none;
        `}
      >
        <ProgressBar
          initiallyAnimated={initiallyAnimated}
          className={progressBarClassName}
          innerClassName={innerProgressbarClassName}
          progress={(currentStep / (steps.length - 1)) * 100}
        />
      </div>
    </div>
  );
};
