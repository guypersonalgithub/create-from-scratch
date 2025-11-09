import { Router, useQueryParamsState } from "@packages/router";
import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";
import { ModalManager } from "@packages/modal";
import { NotFound } from "./routes/NotFound";
import { MainRoute } from "./routes/MainRoute";
import { ToastManager } from "@packages/toast";
import { SpecificDependency } from "./routes/SpecificDependency";
import { TriggerPopperManager } from "@packages/trigger-popper";
import { MinimizableSidebar } from "@packages/sidebar";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { useFetchDependencies } from "./useFetchDependencies";
import { useMoveToSpecificDependencyPage } from "./routes/useMoveToSpecificDependencyPage";
import { dynatic } from "@packages/dynatic-css";

const App = () => {
  return (
    <>
      <div
        className={dynatic`
          width: 100%;
          height: 100vh;
          display: flex;
          overflow: hidden;
        `}
      >
        <MinimizableSidebar
          title={
            <span
              className={dynatic`
                width: fit-content;
                font-size: 26px;
                font-weight: bold;
              `}
            >
              Dependensee
            </span>
          }
          links={[]}
          onLinkClick={() => console.log("?")}
          openedWidth={200}
          closedWidth={50}
          containerClassName={dynatic`
            border-top-right-radius: 0;  
          `}
        />
        <div
          className={dynatic`
            width: 100%;
            overflow: auto;
          `}
        >
          <div
            className={dynatic`
              position: relative;
              display: flex;
              justify-content: end;
              padding-right: 10px;
              padding-top: 10px;
              padding-bottom: 10px;
              height: 30px;
              background-color: #1f1616;
            `}
          >
            <div
              className={dynatic`
                position: fixed;
                z-index: 3;
              `}
            >
              <AutoComplete />
            </div>
          </div>
          <Router
            wrapperClassName={dynatic`
              margin: 20px;
            `}
            paths={{
              "/": <MainRoute />,
              "/dependency": {
                "/:dependency": <SpecificDependency />,
              },
              "404": <NotFound />,
            }}
          />
        </div>
      </div>
      <TooltipManager />
      <ModalManager />
      <ToastManager />
      <TriggerPopperManager />
    </>
  );
};

const AutoComplete = () => {
  const { pagination } = useQueryParamsState({ specificParams: ["pagination"] });
  const paginationValue = Array.isArray(pagination) ? 1 : Number(pagination ?? 1);
  const { data = [], isLoading } = useFetchDependencies({ paginationValue });
  const { moveToDependencyPage } = useMoveToSpecificDependencyPage();

  const options = data.map((dependency) => {
    return {
      label: dependency.name,
      value: dependency.name,
    };
  });

  return (
    <div
      className={dynatic`
        width: 200px;
      `}
    >
      <AutoCompleteInput
        debounceDelay={300}
        autocompleteOptionsCallback={(text) => {
          const lowercaseText = text.toLowerCase();

          return options.filter((searchable) =>
            searchable.label.toLowerCase().includes(lowercaseText),
          );
        }}
        callback={(option) => moveToDependencyPage({ name: option.label })}
        isLoading={isLoading}
        inputWrapperClassName={dynatic`
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          height: 30px;
          align-items: center;  
        `}
        inputPlaceholder="Search"
        optionContent={({ result }) => {
          return (
            <EllipsisTooltip
              content={result.label}
              className={dynatic`
                width: 175px;
              `}
            >
              {result.label}
            </EllipsisTooltip>
          );
        }}
        clearInputOnPick
      />
    </div>
  );
};

export default App;
