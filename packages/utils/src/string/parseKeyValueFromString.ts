type ParseKeyValueFromStringArgs = {
  str: string;
};

export const parseKeyValueFromString = ({ str }: ParseKeyValueFromStringArgs) => {
  const input = str.trim();
  const match = input.match(/^\s*("[^"]+"|'[^']+')\s*:\s*(.*)$/);

  if (!match) {
    throw new Error("Invalid input string");
  }

  const key = match[1].trim();
  const value = match[2].trim();

  return { key, value };
};
