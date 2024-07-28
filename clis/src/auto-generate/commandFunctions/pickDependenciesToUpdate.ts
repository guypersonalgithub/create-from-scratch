// import { detectAllRepositoryDependencies, multiOptions, requestUserInput } from "dev-tools";

export const pickDependenciesToUpdate = async () => {
  // const dependencies = detectAllRepositoryDependencies();
  // const allRepositoryDependencies = Object.keys(dependencies).map((dependency) => {
  //   return {
  //     value: dependency,
  //     label: dependency,
  //   };
  // });
  // const selectedDependencies = await multiOptions({
  //   options: allRepositoryDependencies,
  //   prefixText: "Please pick the dependencies you'd like to update:\n",
  //   suffixText: "\nPress Enter to confirm",
  // });
  // console.log({ selectedDependencies });
  // const action = await requestUserInput({
  //   question: "Would you like to update a package, or do nothing?",
  // });
  // if (action === "do nothing" || action !== "update a package") {
  //   return;
  // }
  // const allPackagesAvailable = Object.keys(dependencies);
  // const response = await requestUserInput({
  //   question: `Please pick a package from the following list:\r\n ${allPackagesAvailable.join(
  //     ",\r\n",
  //   )}`,
  // });
  // if (!allPackagesAvailable.includes(response)) {
  //   console.error("An incorrect package name was typed.");
  //   return;
  // }
  // const packageOptions = dependencies[response];
  // console.log(packageOptions);
  // console.log("Under development, updating packages will be added soon.");
};
