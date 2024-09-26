import path from "path";

type GetRelativePathArgs = {
  from: string;
  to: string;
};

export const getRelativePath = ({ from, to }: GetRelativePathArgs) => {
  const relativePath = path.relative(from, to);
  const separator = path.sep;
  const formattedRelativePath = relativePath.split(separator).join("/");
  return formattedRelativePath;
};
