type OverrideConsoleLogArgs = {
  fn: () => void;
};

export const overrideConsoleLog = ({ fn }: OverrideConsoleLogArgs) => {
  const logs: string[] = [];
  const originalLog = console.log;

  console.log = (...args: any[]) => {
    // originalLog("[overrideConsoleLog captured]:", ...args); // Avoid recursion
    logs.push(args.map(String).join(" "));
  };

  try {
    fn();
  } finally {
    console.log = originalLog;
  }

  return logs;
};

type OverrideConsoleLogAsyncArgs = {
  fn: () => Promise<void>;
};

export const overrideConsoleLogAsync = async ({ fn }: OverrideConsoleLogAsyncArgs) => {
  const logs: string[] = [];
  const originalLog = console.log;

  console.log = (...args: any[]) => {
    logs.push(args.map(String).join(" "));
  };

  try {
    await fn();
  } finally {
    console.log = originalLog;
  }

  return logs;
};
