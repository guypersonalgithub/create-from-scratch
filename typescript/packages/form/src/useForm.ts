import { useContext } from "react";
import { FormContext, type FormContextType } from "./FormContext";

type GetFormHookArgs<T extends Record<string, unknown>> = {
  initialValues: T;
};

export const getFormHook = <T extends Record<string, unknown>>({
  initialValues,
}: GetFormHookArgs<T>) => {
  const useForm = (): FormContextType<T> => {
    const context = useContext(FormContext);
    if (!context) {
      throw new Error("useForm must be used within a FormProvider");
    }

    return context as FormContextType<T>;
  };

  return { useForm };
};
