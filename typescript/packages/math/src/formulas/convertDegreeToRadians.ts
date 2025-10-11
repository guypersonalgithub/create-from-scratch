type ConvertegreeToRadiansArgs = {
  degree: number;
};

export const convertDegreeToRadians = ({ degree }: ConvertegreeToRadiansArgs) =>
  (degree * Math.PI) / 180;
