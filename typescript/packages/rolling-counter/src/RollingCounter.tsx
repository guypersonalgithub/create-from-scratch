import { useEffect, useState } from "react";
import { formatNumbers } from "./utils";
import { DigitsContainer } from "./DigitsContainer";

type RollingCounterProps = {
  from: number;
  to: number;
  duration?: number;
};

export const RollingCounter = ({ from, to, duration = 50 }: RollingCounterProps) => {
  const [fromState, setFromState] = useState(from);
  const [toState, setToState] = useState(to);

  useEffect(() => {
    if (to === toState) {
      return;
    }

    setFromState(toState);
    setToState(to);
  }, [to]);

  const initial = formatNumbers({ from: fromState, to: toState });

  return <DigitsContainer initial={initial} from={from} to={to} duration={duration} />;
};
