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

      return `${className.slice(0, indexOfProperty)}.css-${hashString({ input: className.slice(indexOfProperty + 2) })}`;
    })
    .join(" .");
};
