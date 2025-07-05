type ClickArgs = {
  element: HTMLElement;
};

export const click = ({ element }: ClickArgs) => {
  element.click();
};
