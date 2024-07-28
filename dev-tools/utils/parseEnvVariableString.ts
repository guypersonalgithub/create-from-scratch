type ParseEnvironmentStringArgs = {
  environmentString: string;
};

export const parseEnvironmentString = ({
  environmentString,
}: ParseEnvironmentStringArgs) => {
  const environmentVariableIdentifier = "=${";
  const isEnvironmentVariableString = environmentString.indexOf(
    environmentVariableIdentifier
  );
  if (isEnvironmentVariableString === -1) {
    const splitString = environmentString.split("=");
    return splitString?.[1];
  }

  const splitString = environmentString.split(environmentVariableIdentifier);
  const variableName = splitString?.[1];
  const envKey = variableName.slice(0, variableName.length - 1);
  return process.env[envKey];
};
