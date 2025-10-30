import { dynatic } from "@packages/dynatic-css";
import * as Icons from "@packages/icons";

export const AllIcons = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {Object.entries(Icons).map(([name, Component]) => (
        <div key={name} style={{ textAlign: "center" }}>
          <Component
            className={dynatic`
              width: 24px;
              height: 24px;
            `}
          />
          <div>{name}</div>
        </div>
      ))}
    </div>
  );
};

export default {
  title: "Icons/All",
};
