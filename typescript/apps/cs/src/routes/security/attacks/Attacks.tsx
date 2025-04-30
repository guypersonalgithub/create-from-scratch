import { SubRouter } from "@packages/router";
import { AttacksRoot } from "./AttacksRoot";
import { ForkBombAttack } from "./ForkBombAttack";

export const Attacks = () => {
  return (
    <div>
      <SubRouter
        paths={{
          "/": <AttacksRoot />,
          "/fork-bomb": <ForkBombAttack />,
        }}
      />
    </div>
  );
};
