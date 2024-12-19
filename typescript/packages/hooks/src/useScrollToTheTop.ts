import { useEffect } from "react";

type UseScrollToTheTopArgs = {
  changingDependency?: boolean | string | number;
};

type ScrollParentToTopArgs = {
  element: HTMLElement;
};

export const useScrollWindowToTheTop = ({ changingDependency }: UseScrollToTheTopArgs = {}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [changingDependency]);
};

const elementHasOverflow = ({ element }: ScrollParentToTopArgs) => {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
};

const elementIsScrollable = ({ element }: ScrollParentToTopArgs) => {
  return (
    getComputedStyle(element).overflowY === "scroll" ||
    getComputedStyle(element).overflowY === "auto"
  );
};

export const useScrollToTheTopManual = () => {
  const scrollWindowToTheTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollParentToTop = ({ element }: ScrollParentToTopArgs) => {
    let parent: HTMLElement | null = element.parentElement;

    while (parent) {
      const hasScrollableOverflow = elementHasOverflow({ element: parent });
      const isScrollable = elementIsScrollable({ element: parent });

      if (hasScrollableOverflow && isScrollable) {
        parent.scrollTo(0, 0);
        break;
      }

      parent = parent.parentElement;
    }
  };

  const scrollFirstOverflowedParentToTop = ({ element }: ScrollParentToTopArgs) => {
    let parent: HTMLElement | null = element.parentElement;

    while (parent) {
      const isScrollable = elementIsScrollable({ element: parent });
      if (isScrollable) {
        parent.scrollTo(0, 0);
        break;
      }

      parent = parent.parentElement;
    }
  };

  return { scrollWindowToTheTop, scrollParentToTop, scrollFirstOverflowedParentToTop };
};
