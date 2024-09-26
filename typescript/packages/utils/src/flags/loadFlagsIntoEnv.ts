import { getFlags } from "./getFlags";

export const loadFlagsIntoEnv = () => {
  const flags = getFlags();

  flags.forEach((flag) => {
    const { key, value } = flag;
    const valueString = value.join(", ");
    const envKey = key.toUpperCase();

    process.env[envKey] = valueString;
  });
};
