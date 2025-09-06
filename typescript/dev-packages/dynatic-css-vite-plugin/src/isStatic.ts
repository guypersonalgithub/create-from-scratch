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
};

export const isStatic = ({ isRowStatic, mediaQuery, pseudoClass }: IsStaticArgs) => {
  const isStatic = [isRowStatic, mediaQuery?.isStatic, pseudoClass?.isStatic]
    .filter((value) => value !== undefined)
    .every((value) => value);

  return isStatic;
};
