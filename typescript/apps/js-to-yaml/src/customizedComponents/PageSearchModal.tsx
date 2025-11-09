import { usePath } from "@packages/router";
import { SearchModal, SearchModalOption, SearchModalProps } from "@packages/search-modal";

const options: SearchModalOption[] = [
  {
    value: "/",
    label: "Home",
  },
  {
    value: "/documentation",
    label: "Documentation",
    description: "Read a short summary of the capabilities of the library.",
  },
  {
    value: "/examples",
    label: "Examples",
  },
  {
    value: "/playground",
    label: "Playground",
    description: "Play with the library's main functionalities and experience them in real time",
  },
  {
    value: "/documentation/quickstart",
    label: "Quick Start",
    description: "Learn how to start using the library itself with a single step.",
  },
  {
    value: "/documentation/converttoyaml",
    label: "Convert to YAML",
    description: "Learn how to convert Javascript objects into formatted YAMLs.",
  },
  {
    value: "/documentation/converttojavascript",
    label: "Convert to Javascript",
    description: "Learn how to convert formatted YAMLs into Javascript objects.",
  },
];

type PageSearchModalProps = Omit<SearchModalProps, "options" | "onPickCallback">;

export const PageSearchModal = (args: PageSearchModalProps) => {
  const { moveTo } = usePath();

  return (
    <SearchModal
      {...args}
      options={options}
      onPickCallback={({ value }) => moveTo({ pathname: value })}
    />
  );
};
