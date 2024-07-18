// TODO: Add an option for state on query param change.

let queryParams: Record<string, string | number> = {};

export const useQueryParams = () => {
  return queryParams;
};

export const useInnerQueryParams = () => {
  const setQueryParams = () => {
    const splittedQueryString = window.location.search.slice(1, window.location.search.length);
    const queryStringParams = splittedQueryString.split("&");

    queryStringParams.forEach((queryParam) => {
      const variableValueSplit = queryParam.split("=");
      queryParams[variableValueSplit[0]] = variableValueSplit[1];
    });
  };

  const resetQueryParams = () => {
    queryParams = {};
  };

  return {
    setQueryParams,
    resetQueryParams,
  };
};
