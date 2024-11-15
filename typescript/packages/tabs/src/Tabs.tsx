import { MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Tab } from "./types";
import { AnimationContainerWrapper } from "@packages/animation-container";

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
};

// Props for the case where onClick is outside Tab
type TabsPropsWithExternalOnClick<T extends Tab[]> = {
  tabs: TabWithoutOnClick<T>;
  selected: TabValues<T>;
  onClick: (value: string) => void;
};

function Tabs<T extends Tab[]>(props: TabsPropsWithInternalOnClick<T>): JSX.Element;
function Tabs<T extends Tab[]>(props: TabsPropsWithExternalOnClick<T>): JSX.Element;

function Tabs<T extends Tab[]>({
  tabs,
  selected,
  onClick,
}: TabsPropsWithInternalOnClick<T> | TabsPropsWithExternalOnClick<T>) {
  const refs = useRef<HTMLDivElement[]>([]);
  const selectedIndex = useRef<number>(tabs.findIndex((tab) => tab.value === selected));
  const isInitialState = useRef<boolean>(true);

  const addDivRef = ({ element, index }: { element: HTMLDivElement | null; index: number }) => {
    if (!element) {
      return;
    }

    refs.current[index] = element;
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        marginBottom: "10px",
      }}
    >
      <>
        {tabs.map((tab, index) => {
          const handleClick = () => {
            const callback =
              "onClick" in tab && typeof tab.onClick === "function" ? tab.onClick : onClick;
            callback?.(tab.value);
            selectedIndex.current = index;
            isInitialState.current = false;
          };

          return (
            <div
              key={tab.value}
              ref={(element) => addDivRef({ element, index })}
              style={{
                cursor: "pointer",
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingTop: "5px",
                paddingBottom: "5px",
                backgroundColor: tab.value === selected ? "" : undefined,
              }}
              onClick={handleClick}
            >
              {tab.label ?? tab.value}
            </div>
          );
        })}
        <HighlightBar
          refs={refs}
          selectedIndex={selectedIndex.current}
          isInitialState={isInitialState.current}
        />
      </>
    </div>
  );
}

type HighlightBarProps = {
  refs: MutableRefObject<HTMLDivElement[]>;
  selectedIndex: number;
  isInitialState: boolean;
};

const HighlightBar = ({ refs, selectedIndex, isInitialState }: HighlightBarProps) => {
  const firstTabLeftPosition = useRef<number>(0);
  const lastTab = useRef<TabProperties>({
    width: 0,
    left: 0,
  });
  const [tabProperties, setTabPropeties] = useState<TabProperties>({
    width: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    firstTabLeftPosition.current = refs.current?.[0]?.getBoundingClientRect()?.left ?? 0;
  }, []);

  useEffect(() => {
    const getRefProperties = (ref: HTMLDivElement | null) => {
      const { width, left } = ref?.getBoundingClientRect() ?? {
        width: 0,
        left: 0,
      };

      return {
        width,
        left: left - firstTabLeftPosition.current,
      };
    };

    lastTab.current = tabProperties;
    setTabPropeties(getRefProperties(refs.current[selectedIndex]));
  }, [selectedIndex]);

  const animation = useMemo(() => {
    return [
      { width: `${lastTab.current.width}px`, left: `${lastTab.current.left}px` },
      {
        width: `${tabProperties.width}px`,
        left: `${tabProperties.left}px`,
      },
    ];
  }, [tabProperties]);

  return (
    <AnimationContainerWrapper
      changeMethod="fullPhase"
      animation={animation}
      animationOptions={{ duration: 300, easing: "ease-out" }}
      style={{
        position: "absolute",
        width: `${tabProperties.width}px`,
        bottom: "-5px",
        left: `${tabProperties.left}px`,
      }}
      disableAnimation={isInitialState}
    >
      <div key="bar" style={{ height: "5px", backgroundColor: "#5662F6" }} />
    </AnimationContainerWrapper>
  );
};

export { Tabs };
