type CalculateSlopeBasedOffAngleAndAnotherSlopeBetweenLinesArgs = {
  degree: number;
  existingSlope: number;
};

// tan(θ) = Math.abs((m2 - m1) / (1 + m1*m2 ))
export const calculateSlopeBasedOffAngleAndAnotherSlopeBetweenLines = ({
  degree,
  existingSlope,
}: CalculateSlopeBasedOffAngleAndAnotherSlopeBetweenLinesArgs) => {
  const calculatedDegree = Math.tan(degree);

  const caseA = (calculatedDegree * (1 + existingSlope)) / (1 - existingSlope);
  const caseB = (-1 * calculatedDegree * (1 + existingSlope)) / (1 - existingSlope);

  return { caseA, caseB };
};
