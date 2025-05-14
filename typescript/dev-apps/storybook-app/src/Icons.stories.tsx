import * as Icons from "@packages/icons";

export const AllIcons = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {Object.entries(Icons).map(([name, Component]) => (
        <div key={name} style={{ textAlign: "center" }}>
          <Component size={24} />
          <div>{name}</div>
        </div>
      ))}
    </div>
  );
};

export default {
  title: "Icons/All",
};
