import {
  detectAllRepositoryDependencies,
  requestUserInput,
} from "utility-scripts";

export const pickDependenciesToUpdate = async () => {
  const dependencies = detectAllRepositoryDependencies();
  console.log(dependencies);

  const action = await requestUserInput({
    question: "Would you like to update a package, or do nothing?",
  });

  if (action === "do nothing" || action !== "update a package") {
    return;
  }

  const allPackagesAvailable = Object.keys(dependencies);

  const response = await requestUserInput({
    question: `Please pick a package from the following list:\r\n ${allPackagesAvailable.join(
      ",\r\n"
    )}`,
  });

  if (!allPackagesAvailable.includes(response)) {
    console.error("An incorrect package name was typed.");
    return;
  }

  const packageOptions = dependencies[response];
  console.log(packageOptions);
  console.log("Under development, updating packages will be added soon.");
};
