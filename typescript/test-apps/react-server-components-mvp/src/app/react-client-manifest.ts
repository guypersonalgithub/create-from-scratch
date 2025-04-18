const ssrManifest = {
  moduleMap: {
    Page: {
      id: "Page",
      chunks: ["Page.js"],
      name: "default",
      async: true
    },
    AsyncComponent: {
      id: "AsyncComponent",
      chunks: ["AsyncComponent.js"],
      name: "default",
      async: true
    }
  },
  serverModuleMap: {}, // optional, usually empty unless using server references
  moduleLoading: "eager" // or "lazy", depending on how you build
};

export default ssrManifest;