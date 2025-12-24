export const markAnimationDone = () => {
  const event = new CustomEvent("finishedMyersVisualizerAnimationPart");
  window.dispatchEvent(event);
};
