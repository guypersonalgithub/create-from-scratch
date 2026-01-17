import { hashString } from "./hashString";

type DescendantSelectorArgs<T extends string> = {
  classNames: (T | `${T}.${string}` | `${T}:${string}` | `${T}--${string}`)[];
};

export const descendantSelector = <T extends string>({ classNames }: DescendantSelectorArgs<T>) => {
  const updatedClassNames = classNames.slice();
  if (updatedClassNames.length === 0) {
    return "";
  }

  updatedClassNames[0] = `.${updatedClassNames[0]}` as T;

  return updatedClassNames
    .map((className) => {
      const indexOfProperty = className.indexOf("--");
      if (indexOfProperty === -1) {
        return className;
      }

      const input = className.slice(indexOfProperty + 2);
      const updated = input[input.length - 1] === ";" ? input.slice(0, input.length - 1) : input;

      return `${className.slice(0, indexOfProperty)}.css-${hashString({ input: updated })}`;
    })
    .join(" .");
};
