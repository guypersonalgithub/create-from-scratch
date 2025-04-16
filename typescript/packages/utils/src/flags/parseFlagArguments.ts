type ParseFlagArgumentsArgs = {
  args: string[];
};

export const parseFlagArguments = ({ args }: ParseFlagArgumentsArgs) => {
  const parsedArguments: Record<string, string> = {};

  args.forEach((arg) => {
    const [key, value] = arg.split("=");
    parsedArguments[key] = value ?? "true";
  });

  return { parsedArguments };
};
