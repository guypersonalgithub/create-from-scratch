import { InputOutput } from "../customizedComponents";
import { dynatic } from "../dynatic-css.config";

export const Examples = () => {
  return (
    <div
      className={dynatic`
        color: ${(config) => config.colors.mainColor};
        transition: ${(config) => config.shared.defaultTransition};
        margin: 1rem;
      `}
    >
      <InputOutput code={{ key: { key1: "value", key2: 2 } }} language="typescript" />
      <InputOutput
        code={{ key: { key1: "value", key2: 2, key3: true, key4: undefined, key5: null } }}
        language="typescript"
      />
      <InputOutput
        code={{ key: "${{ github.event.head_commit.message }}" }}
        language="typescript"
      />
      <InputOutput code={{ run: "npm install\nnpm run build" }} language="typescript" />
      <InputOutput code={{ values: [1, 2, "key", "value"] }} language="typescript" />
      <InputOutput
        code={`key:
  key1: value
  key2: 2`}
        language="yaml"
      />
      <InputOutput
        code={`key:
  key1: value
  key2: 2
  key3: true
  key4: 
  key5: null`}
        language="yaml"
      />
      <InputOutput
        code={`values:
  - 1
  - 2
  - key
  - value`}
        language="yaml"
      />
      <InputOutput
        code={`run: |
  npm install
  npm run build
`}
        language="yaml"
      />
    </div>
  );
};
