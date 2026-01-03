type IsStaticArgs = {
  isRowStatic: boolean;
  mediaQuery?: {
    value: string;
    isStatic: boolean;
  };
  pseudoClass?: {
    value: string;
    isStatic: boolean;
  };
  descendantSelector?: {
    value: string;
    isStatic: boolean;
  };
};

export const isStatic = ({
  isRowStatic,
  mediaQuery,
  pseudoClass,
  descendantSelector,
}: IsStaticArgs) => {
  const isStatic = [
    isRowStatic,
    mediaQuery?.isStatic,
    pseudoClass?.isStatic,
    descendantSelector?.isStatic,
  ]
    .filter((value) => value !== undefined)
    .every((value) => value);

  return isStatic;
};
