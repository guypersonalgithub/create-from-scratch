import { type RefObject, useEffect, useRef, type JSX } from "react";
import { type Tab } from "./types";
import { useAnimation } from "@packages/animation-container";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type TabValues<T extends Tab[]> = T[number]["value"];

type TabProperties = {
  width: number;
  left: number;
};

type TabWithOnClick<T extends Tab[]> = {
  [K in keyof T]: T[K] & { onClick: (value: string) => void };
};

type TabWithoutOnClick<T extends Tab[]> = {
  [K in keyof T]: Omit<T[K], "onClick">;
};

// Props for the case where onClick is inside Tab
type TabsPropsWithInternalOnClick<T extends Tab[]> = {
  tabs: TabWithOnClick<T>;
  selected: TabValues<T>;
  onClick?: never;
  containerClassName?: string;
  className?: string;
  selectedClassName?: string;
  highlightBarClassName?: string;
};

// Props for the case where onClick is outside Tab
type TabsPropsWithExternalOnClick<T extends Tab[]> = {
  tabs: TabWithoutOnClick<T>;
  selected: TabValues<T>;
  onClick: (value: string) => void;
  containerClassName?: string;
  className?: string;
  selectedClassName?: string;
  highlightBarClassName?: string;
};

function Tabs<T extends Tab[]>(props: TabsPropsWithInternalOnClick<T>): JSX.Element;
function Tabs<T extends Tab[]>(props: TabsPropsWithExternalOnClick<T>): JSX.Element;

function Tabs<T extends Tab[]>({
  tabs,
  selected,
  onClick,
  containerClassName,
  className,
  selectedClassName,
  highlightBarClassName,
}: TabsPropsWithInternalOnClick<T> | TabsPropsWithExternalOnClick<T>) {
  const refs = useRef<HTMLDivElement[]>([]);
  const selectedIndex = useRef<number>(tabs.findIndex((tab) => tab.value === selected));

  const addDivRef = ({ element, index }: { element: HTMLDivElement | null; index: number }) => {
    if (!element) {
      return;
    }

    refs.current[index] = element;
  };

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          margin-bottom: 10px;  
        `,
        containerClassName,
      )}
    >
      <div
        className={dynatic`
          display: flex;
        `}
      >
        {tabs.map((tab, index) => {
          const handleClick = () => {
            const callback =
              "onClick" in tab && typeof tab.onClick === "function" ? tab.onClick : onClick;
            callback?.(tab.value);
            selectedIndex.current = index;
          };

          return (
            <div
              key={tab.value}
              ref={(element) => addDivRef({ element, index })}
              className={combineStringsWithSpaces(
                dynatic`
                  cursor: pointer;
                  padding-left: 10px;
                  padding-right: 10px;
                  padding-top: 5px;
                  padding-bottom: 5px;
                  white-space: nowrap;
                `,
                tab.value === selected && selectedClassName,
                className,
              )}
              onClick={handleClick}
            >
              {tab.label ?? tab.value}
            </div>
          );
        })}
      </div>
      <HighlightBar
        className={highlightBarClassName}
        refs={refs}
        selectedIndex={selectedIndex.current}
      />
    </div>
  );
}

type HighlightBarProps = {
  className?: string;
  refs: RefObject<HTMLDivElement[]>;
  selectedIndex: number;
};

const HighlightBar = ({ className, refs, selectedIndex }: HighlightBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerLeft = useRef<number>(0);
  const lastTab = useRef<TabProperties>({
    width: 0,
    left: 0,
  });
  const { animate } = useAnimation();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const setContainerLeft = () => {
      if (!containerRef.current) {
        return;
      }

      const { left } = containerRef.current.getBoundingClientRect();
      containerLeft.current = left;
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerLeft();
        }
      }
    });

    observer.observe(containerRef.current);

    setContainerLeft();

    return () => {
      if (!containerRef.current) {
        return;
      }

      observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    const getRefProperties = (ref: HTMLDivElement | null) => {
      const { width, left } = ref?.getBoundingClientRect() ?? {
        width: 0,
        left: 0,
      };

      return {
        width,
        left: left - containerLeft.current,
      };
    };

    const newTabProperties = getRefProperties(refs.current[selectedIndex]);

    if (highlightRef.current) {
      const animation = [
        {
          width: `${lastTab.current.width}px`,
          left: `${lastTab.current.left}px`,
        },
        {
          width: `${newTabProperties.width}px`,
          left: `${newTabProperties.left}px`,
        },
      ];
      const animationOptions = { duration: 300, easing: "ease-out" };

      const {} = animate({ element: highlightRef.current, animation, animationOptions });

      lastTab.current = newTabProperties;
    }
  }, [selectedIndex]);

  return (
    <div
      ref={containerRef}
      className={dynatic`
        position: relative;
      `}
    >
      <div
        ref={highlightRef}
        className={dynatic`
          position: absolute;
          bottom: -5px;  
        `}
      >
        <div
          key="bar"
          className={combineStringsWithSpaces(
            dynatic`
              height: 5px;
              background-color: #5662F6;
            `,
            className,
          )}
        />
      </div>
    </div>
  );
};

export { Tabs };
