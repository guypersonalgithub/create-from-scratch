import { dynatic } from "@packages/dynatic-css";
import * as Icons from "@packages/flag-icons";

export const AllIcons = () => {
  return (
    <div
      className={dynatic`
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      `}
    >
      {Object.entries(Icons).map(([name, Component]) => (
        <div
          key={name}
          className={dynatic`
            text-align: center;
          `}
        >
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
  title: "FlagIcons/All",
};
