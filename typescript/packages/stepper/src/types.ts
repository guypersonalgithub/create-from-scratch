import type { ProgressBarProps } from "@packages/progress-bar";
import type { AllPropertiesOfType } from "@packages/utils";
import type { ReactNode } from "react";

export type Step = {
  label: ReactNode;
  content: ReactNode;
};

type ProgressBarRelatedProps = Pick<ProgressBarProps, "initiallyAnimated">;

export type StepperStagesProps = {
  steps: Step[];
  stepClassName?: string;
  currentStepClassName?: string;
  currentStep: number;
  setCurrentStep: (index: number) => void;
} & ProgressBar;

type ProgressBar =
  | ({
      includeProgressBar?: true;
      progressBarClassName?: string;
      innerProgressbarClassName?: string;
    } & ProgressBarRelatedProps)
  | ({
      includeProgressBar?: never;
      progressBarClassName?: never;
      innerProgressbarClassName?: never;
    } & AllPropertiesOfType<ProgressBarRelatedProps, never>);
