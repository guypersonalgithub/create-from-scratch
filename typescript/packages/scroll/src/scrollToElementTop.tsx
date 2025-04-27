import { getScrollParent } from "./getScrollParent";
import { ScrollOptions } from "./types";

type ScrollToElementTopArgs = {
  element: Element;
  options?: ScrollOptions;
};

export const scrollToElementTop = ({ element, options }: ScrollToElementTopArgs) => {
  const { behavior = "smooth", offset = 0 } = options || {};

  const scrollParent = getScrollParent({ element });

  const elementRect = element.getBoundingClientRect();

  if (scrollParent === window) {
    const absoluteElementTop = window.pageYOffset + elementRect.top;
    window.scrollTo({
      top: absoluteElementTop - offset,
      behavior,
    });
  } else {
    const parent = scrollParent as HTMLElement;
    const parentRect = parent.getBoundingClientRect();
    const scrollTop = parent.scrollTop;
    const elementTopRelativeToParent = elementRect.top - parentRect.top + scrollTop;

    parent.scrollTo({
      top: elementTopRelativeToParent - offset,
      behavior,
    });
  }
};
