type GetScrollParentArgs = {
  element: Element;
};

export const getScrollParent = ({ element }: GetScrollParentArgs): HTMLElement | Window => {
  let parent = element.parentElement;

  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
      return parent;
    }
    parent = parent.parentElement;
  }

  return window;
};
