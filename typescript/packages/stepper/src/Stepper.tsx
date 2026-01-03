import { useState } from "react";
import type { Step, StepperStagesProps } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { StepperStages } from "./StepperStages";

type StepperProps = Omit<StepperStagesProps, "currentStep" | "setCurrentStep"> & {
  initialStep?: number;
  onStepChange?: (stepIndex: number) => void;
};

export const Stepper = ({
  steps,
  stepClassName,
  currentStepClassName,
  initialStep = 0,
  onStepChange,
  includeProgressBar,
  progressBarClassName,
  innerProgressbarClassName,
  initiallyAnimated,
}: StepperProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  return (
    <div
      className={dynatic`
        display: flex;
        flex-direction: column;  
      `}
    >
      <StepperStages
        steps={steps}
        stepClassName={stepClassName}
        currentStepClassName={currentStepClassName}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        includeProgressBar={includeProgressBar}
        progressBarClassName={progressBarClassName}
        innerProgressbarClassName={innerProgressbarClassName}
        initiallyAnimated={initiallyAnimated}
      />
    </div>
  );
};
