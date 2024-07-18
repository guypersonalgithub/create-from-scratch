export const usePath = () => {
  const getPathName = () => {
    return window.location.pathname;
  };

  const moveTo = ({ pathname }: { pathname: string }) => {
    if (pathname === window.location.pathname) {
      return;
    }
    
    window.history.pushState({ path: pathname }, "", pathname);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return {
    getPathName,
    moveTo,
  };
};
