import { Tab } from "./types";

type TabValues<T extends Tab[]> = T[number]["value"];

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
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {tabs.map((tab) => {
        const handleClick = () => {
          const callback =
            "onClick" in tab && typeof tab.onClick === "function" ? tab.onClick : onClick;
          callback?.(tab.value);
        };

        return (
          <div
            key={tab.value}
            style={{
              cursor: "pointer",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "5px",
              paddingBottom: "5px",
              backgroundColor: tab.value === selected ? "red" : undefined,
            }}
            onClick={handleClick}
          >
            {tab.label ?? tab.value}
          </div>
        );
      })}
    </div>
  );
}

export { Tabs };
