import { InputOutput } from "../styledComponents";

export const Examples = () => {
  return (
    <div style={{ color: "var(--theme-color)", transition: "var(--theme-transition)", margin: "1rem" }}>
      <InputOutput code={{ key: { key1: "value", key2: 2 } }} language="typescript" withWebWorker />
      <InputOutput
        code={{ key: { key1: "value", key2: 2, key3: true, key4: undefined, key5: null } }}
        language="typescript"
        withWebWorker
      />
      <InputOutput
        code={{ key: "${{ github.event.head_commit.message }}" }}
        language="typescript"
        withWebWorker
      />
      <InputOutput
        code={{ run: ["npm install", "npm run build"] }}
        language="typescript"
        withWebWorker
      />
      <InputOutput code={{ values: [1, 2, "key", "value"] }} language="typescript" withWebWorker />
    </div>
  );
};
