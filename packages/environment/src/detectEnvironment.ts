export const detectEnvironment = (): "frontend" | "backend" => {
  if (typeof window !== "undefined") {
    return "frontend";
  } else {
    return "backend";
  }
};
