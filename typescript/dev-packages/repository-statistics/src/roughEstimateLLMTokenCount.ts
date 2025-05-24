type RoughEstimateLLMTokenCountArgs = {
  text: string;
};

export const roughEstimateLLMTokenCount = ({ text }: RoughEstimateLLMTokenCountArgs) => {
  return Math.ceil(text.length / 3.5); // LLM-style rough token estimate
};
