type ObserveElementVisibilityArgs = {
  element: HTMLElement;
  observerCallback: (args: { isIntersection: boolean }) => void;
};

export const observeElementVisibility = ({
  element,
  observerCallback,
}: ObserveElementVisibilityArgs) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        observerCallback({ isIntersection: entry.isIntersecting });
      });
    },
    {
      threshold: [0],
    },
  );

  observer.observe(element);

  return observer;
};

type ObserveElementsVisibilityArgs = {
  elements: HTMLElement[];
  identificationCallback?: (args: { id: string }) => boolean;
  intersectionCallback: (args: { element: Element }) => void;
  removalCallback: (args: { element: Element }) => void;
  threshold?: number[];
};

export const observeElementsVisibility = ({
  elements,
  identificationCallback,
  intersectionCallback,
  removalCallback,
  threshold = [0],
}: ObserveElementsVisibilityArgs) => {
  const callback = identificationCallback
    ? ({ entry }: { entry: IntersectionObserverEntry }) => {
        if (identificationCallback({ id: entry.target.id })) {
          const element = entry.target;

          if (entry.isIntersecting) {
            intersectionCallback({ element });
          } else {
            removalCallback({ element });
          }
        }
      }
    : ({ entry }: { entry: IntersectionObserverEntry }) => {
        const element = entry.target;
        if (entry.isIntersecting) {
          intersectionCallback({ element });
        } else {
          removalCallback({ element });
        }
      };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callback({ entry });
      });
    },
    {
      threshold,
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  return observer;
};
