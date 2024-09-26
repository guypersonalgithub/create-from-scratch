type ObserveElementVisibilityArgs = {
  element: HTMLElement;
  observerCallback: () => void;
};

export const observeElementVisibility = ({
  element,
  observerCallback,
}: ObserveElementVisibilityArgs) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observerCallback();
        }
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
  identificationCallback: (id: string) => boolean;
  intersectionCallback: () => void;
  removalCallback: () => void;
  threshold?: number[];
};

export const observeElementsVisibility = ({
  elements,
  identificationCallback,
  intersectionCallback,
  removalCallback,
  threshold = [0],
}: ObserveElementsVisibilityArgs) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (identificationCallback(entry.target.id)) {
          if (entry.isIntersecting) {
            intersectionCallback();
          } else {
            removalCallback();
          }
        }
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
