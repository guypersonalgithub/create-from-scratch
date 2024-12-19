type GetComputedStylePropertiesArgs<T extends (keyof CSSStyleDeclaration)[]> = {
  element: HTMLElement;
  properties: T;
};

export const getComptuedStyleProperties = <T extends (keyof CSSStyleDeclaration)[]>({
  element,
  properties,
}: GetComputedStylePropertiesArgs<T>) => {
  const propertyValues = {} as Record<T[number], string>;
  const computedStyle = window.getComputedStyle(element);
  properties.forEach((property) => {
    propertyValues[property as T[number]] = computedStyle[property] as string;
  });

  return propertyValues;
};
