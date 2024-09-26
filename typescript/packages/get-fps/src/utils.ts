type CalculateAverageFPSArgs = {
  fps: number[];
};

export const calculateAverageFPS = ({ fps = [] }: CalculateAverageFPSArgs) => {
  if (fps.length === 0) {
    return 0;
  }

  const fpsSum = fps.reduce((sum, current) => sum + current, 0);

  return Number((fpsSum / fps.length).toFixed(2));
};

type CalculateMaxFPSArgs = {
  fps: number[];
};

export const calculateMaxFPS = ({ fps = [] }: CalculateMaxFPSArgs) => {
  if (fps.length === 0) {
    return 0;
  }

  return Math.max(...fps);
};
