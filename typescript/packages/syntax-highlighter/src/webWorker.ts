import { type SupportedLanguages, supportedLanguages } from "./languages";

self.onmessage = (e: MessageEvent<{ code: string; language: SupportedLanguages }>) => {
  const { code, language } = e.data;

  const { callback, baseColors } = supportedLanguages[language];
  const tokens = callback({ input: code });

  postMessage({ tokens, baseColors });
};

export {}; // Required for TS module isolation
