type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | Record<string, boolean>;

export const combineStringsWithSpaces = (...args: ClassValue[]) => {
  const classes: string[] = [];

  args.forEach((arg) => {
    if (!arg) {
      return;
    }

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      const nestedClasses = combineStringsWithSpaces(...arg);

      if (nestedClasses) {
        classes.push(nestedClasses);
      }
    } else if (typeof arg === "object") {
      Object.keys(arg).forEach((key) => {
        if ((arg as Record<string, boolean>)[key]) {
          classes.push(key);
        }
      });
    }
  });

  if (classes.length === 0) {
    return;
  }

  return classes.join(" ");
};
