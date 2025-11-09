import { dynatic } from "@packages/dynatic-css";

export const FillerCell = () => {
  return (
    <div
      className={dynatic`
        width: 50px;
        height: 50px;
      `}
    />
  );
};
