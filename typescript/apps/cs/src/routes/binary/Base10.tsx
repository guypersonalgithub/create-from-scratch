import { StyledMainTitle } from "../../styledComponents/StyledMainTitle";
import { Base10Simulation } from "./Base10Simulation";
import { convertNumberToBinary } from "@packages/binary";

export const Base10 = () => {
  const value = convertNumberToBinary({ num: 7 });

  return (
    <div>
      <StyledMainTitle>Base 10 to binary</StyledMainTitle>
      <div>{value}</div>
      <Base10Simulation startFrom={0} to={7} />
    </div>
  );
};
