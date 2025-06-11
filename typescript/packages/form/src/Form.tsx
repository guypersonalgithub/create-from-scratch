import { ChangeEvent, FormEvent, ReactNode, RefObject, useEffect, useState } from "react";
import { FormContext, FormContextType, RegisterArgs, UseFormStateArgs } from "./FormContext";
import { Validators } from "./types";
import { Observer } from "@packages/design-patterns";
import { pickValues } from "./utils";

type FormProps<T extends Record<string, unknown>> = {
  initialValues: T;
  validators?: Validators<T>;
  onSubmit: (args: { event?: FormEvent<HTMLFormElement>; values: T }) => void;
  children: ReactNode;
  ref?: RefObject<HTMLFormElement | null>;
};

export const Form = <T extends Record<string, unknown>>({
  initialValues,
  validators,
  onSubmit,
  children,
  ref,
}: FormProps<T>) => {
  const observer = new Observer(initialValues);

  const useFormState = <K extends keyof T = keyof T>({ values }: UseFormStateArgs<T, K>) => {
    const [state, setState] = useState<Partial<Pick<T, K>>>(() => {
      const fullState = observer.getState();
      const picked = pickValues({ obj: fullState, keys: values });
      return picked;
    });

    const key = values.join("");

    useEffect(() => {
      const unsubscribe = observer.subscribe({
        properties: values,
        full: false,
        callback: (values) => setState(values),
        initial: true,
      });

      return () => unsubscribe();
    }, [key]);

    return state;
  };

  const useFormRegister = () => {
    const register = ({ key }: RegisterArgs<T>) => {
      return {
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          observer.setState({ [key]: value } as Partial<T>);
        },
      };
    };

    return { register };
  };

  return (
    <FormContext.Provider
      value={{
        observer,
        validators,
        onSubmit,
        useFormState: useFormState as FormContextType<T>["useFormState"],
        useFormRegister,
      }}
    >
      <form
        ref={ref}
        onSubmit={(event) => {
          const values = observer.getState();
          onSubmit({ event, values });
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};
