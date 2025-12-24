const memoryMarks = new Map<string, number>();

type ConsoleMemoryArgs = {
  label: string;
};

export const consoleMemoryStart = ({ label }: ConsoleMemoryArgs) => {
  if (!global.gc) {
    throw "The garbage collector isn't available during the runtime, so measuring the memory is impossible.";
  }
  memoryMarks.set(label, process.memoryUsage().heapUsed);
};

export const consoleMemoryEnd = ({ label }: ConsoleMemoryArgs) => {
  if (!memoryMarks.has(label)) {
    return console.error("The given label was not found in the console memories cache.");
  }

  if (!global.gc) {
    throw "The garbage collector isn't available during the runtime, so measuring the memory is impossible.";
  }
  const diff = process.memoryUsage().heapUsed - memoryMarks.get(label)!;

  console.log(`${label}: ${(diff / 1024).toFixed(2)} KB`);
  memoryMarks.delete(label);
};
