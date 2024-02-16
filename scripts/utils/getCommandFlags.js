const getCommandFlags = () => {
  const { argv } = process;
  const flags = argv.slice(2);

  const flagMap = new Map();

  const maximumNumberOfIterations =
    flags.length % 2 === 0 ? flags.length : flags.length - 1;

  for (let i = 0; i < maximumNumberOfIterations; i += 2) {
    const key = flags[i];
    const value = flags[i + 1];
    const parsedKey = key.replace("--", "");
    flagMap.set(parsedKey, value);
  }

  return flagMap;
};

module.exports = {
  getCommandFlags,
};
