type ConvertRadiansToDegreeArgs = {
  radians: number;
};

export const convertRadiansToDegree = ({ radians }: ConvertRadiansToDegreeArgs) => {
  return radians * (180 / Math.PI);
};
