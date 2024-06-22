import { normalize, sep } from "path";

type RemoveLastPathSegmentArgs = {
  path: string;
};

export const removeLastPathSegment = ({ path }: RemoveLastPathSegmentArgs) => {
  const normalizedPath = normalize(path);
  const segments = normalizedPath.split(sep);
  segments.pop();
  return segments.join(sep);
};
