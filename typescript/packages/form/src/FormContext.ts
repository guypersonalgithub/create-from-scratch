import { Observer } from "@packages/design-patterns";
import { createContext, ChangeEvent } from "react";
import { Validators } from "./types";

export type UseFormStateArgs<T extends Record<string, unknown>, K extends keyof T = keyof T> = {
  values: K[];
};

export type RegisterArgs<T extends Record<string, unknown>> = {
  key: keyof T;
};

export type FormContextType<T extends Record<string, unknown>> = {
  observer: Observer<T>;
  validators?: Validators<T>;
  onSubmit: (args: { values: T }) => void;
  useFormState: <K extends keyof T = keyof T>({
    values,
  }: UseFormStateArgs<T, K>) => Partial<Pick<T, K>>;
  useFormRegister: () => {
    register: ({ key }: RegisterArgs<T>) => {
      onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    };
  };
};

export const FormContext = createContext<FormContextType<any> | null>(null);
