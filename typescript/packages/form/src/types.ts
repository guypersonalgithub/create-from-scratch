export type Validator<T extends Record<string, unknown>> = (args: {
  value: T[keyof T];
  values: T;
}) => string | null;

export type Validators<T extends Record<string, unknown>> = {
  [K in keyof T]?: Validator<T>;
};

export type UseFormOptions<T extends Record<string, unknown>> = {
  initialValues: T;
  validators?: Validators<T>;
  onSubmit: (args: { values: T }) => void;
};
