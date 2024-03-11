import { useEffect, useRef, useState } from "react";
import { calculateAverageFPS, calculateMaxFPS } from "./utils";

type UseFPSArgs = {
  numberOfRecordsLimit?: number;
};

const second = 1000;

export const useFPS = (args?: UseFPSArgs) => {
  const { numberOfRecordsLimit = 60 } = args || {};

  const [FPS, setFps] = useState<number>(0);
  const lastFPSValues = useRef<number[]>([]);
  const frames = useRef(0);
  const lastIterationTime = useRef(performance.now());
  const allTimeHighMaxFPS = useRef<number>(0);
  const animationRef = useRef(0);

  useEffect(() => {
    const calcFps = () => {
      const currentTime = performance.now();
      frames.current += 1;

      const timeDifference = currentTime - lastIterationTime.current;
      const didAtleastOneSecondPass = timeDifference > second;

      if (didAtleastOneSecondPass) {
        const currentFPS = Math.round(
          (frames.current * second) / timeDifference
        );
        allTimeHighMaxFPS.current = Math.max(
          allTimeHighMaxFPS.current,
          currentFPS
        );
        lastFPSValues.current.push(currentFPS);

        if (timeDifference > second * 1.5) {
          for (let i = 1; i <= (timeDifference - second) / second; i++) {
            lastFPSValues.current.push(0);
          }
        }

        const amountOfRecordedFPSValues = lastFPSValues.current.length;
        const amountOfRecordsAboveLimit =
          amountOfRecordedFPSValues - numberOfRecordsLimit;
        if (amountOfRecordsAboveLimit > 0) {
          lastFPSValues.current = lastFPSValues.current.slice(
            amountOfRecordsAboveLimit
          );
        }

        setFps(currentFPS);

        frames.current = 0;
        lastIterationTime.current = performance.now();
      }

      animationRef.current = requestAnimationFrame(calcFps);
    };

    animationRef.current = requestAnimationFrame(calcFps);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const avgFPS = calculateAverageFPS({ fps: lastFPSValues.current });
  const recordedBatchMaxFPS = calculateMaxFPS({ fps: lastFPSValues.current });

  return {
    FPS,
    avgFPS,
    allTimeHighMaxFPS: allTimeHighMaxFPS.current,
    recordedBatchMaxFPS,
  };
};
