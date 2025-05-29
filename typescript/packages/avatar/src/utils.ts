type NameToColorArgs = {
  name: string;
};

export const nameToColor = ({ name }: NameToColorArgs) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 70%)`; // pastel-ish color
};
