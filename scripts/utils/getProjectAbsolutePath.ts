export const getProjectAbsolutePath = () => {
  const absPath = __dirname.replace("\\scripts\\utils", "");
  return absPath;
};
