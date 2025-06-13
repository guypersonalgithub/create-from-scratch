import { Router, useQueryParamsState } from "@packages/router";
import { EllipsisTooltip, TooltipManager } from "@packages/tooltip";
import { ModalManager } from "@packages/modal";
import { NotFound } from "./routes/NotFound";
import { MainRoute } from "./routes/MainRoute";
import { ToastManager } from "@packages/toast";
import { SpecificDependency } from "./routes/SpecificDependency";
import { Testing } from "./routes/Testing";
import { TriggerPopperManager } from "@packages/trigger-popper";
import { MinimizableSidebar } from "@packages/sidebar";
import { AutoCompleteInput } from "@packages/auto-complete-input";
import { useFetchDependencies } from "./useFetchDependencies";
import { useMoveToSpecificDependencyPage } from "./routes/useMoveToSpecificDependencyPage";

const App = () => {
  return (
    <>
      <div style={{ width: "100%", height: "100vh", display: "flex", overflow: "hidden" }}>
        <MinimizableSidebar
          title={
            <span style={{ width: "fit-content", fontSize: "26px", fontWeight: "bold" }}>
              Dependensee
            </span>
          }
          links={[]}
          onLinkClick={() => console.log("?")}
          openedWidth={200}
          closedWidth={50}
          containerStyle={{ borderTopRightRadius: "0px" }}
        />
        <div style={{ width: "100%", overflow: "auto" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "end",
              paddingRight: "10px",
              paddingTop: "10px",
              paddingBottom: "10px",
              height: "30px",
              backgroundColor: "#1f1616",
            }}
          >
            <div style={{ position: "fixed", zIndex: "3" }}>
              <AutoComplete />
            </div>
          </div>
          <Router
            wrapperStyle={{ margin: "20px" }}
            paths={{
              "/": <MainRoute />,
              "/dependency": {
                "/:dependency": <SpecificDependency />,
              },
              "/testing": <Testing />,
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
    <div style={{ width: "200px" }}>
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
        inputWrapperStyle={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          height: "30px",
          alignItems: "center",
        }}
        inputPlaceholder="Search"
        optionContent={({ result }) => {
          return (
            <EllipsisTooltip content={result.label} style={{ width: "175px" }}>
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
