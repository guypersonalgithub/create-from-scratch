import { test, expect } from "@packages/test";
import { getCurrentOffsetTokens } from "../src/autoComplete/getCurrentOffsetTokens";
import { createParsedFile } from "../src/createParsedFile";
import { getDynaticCSSTextToParse } from "../src/getDynaticCSSTextToParse";

const offset = 124;
const text =
  "dynatic`@media screen and (width >= 500px) and (width: auto) {\n" +
  "    article {\n" +
  "      display: flex;\n" +
  "      color: aliceblue;\n" +
  "      a:\n" +
  "    }\n" +
  "  }`";

const expectedParsedFile: ReturnType<typeof createParsedFile> = [
  {
    tokens: [
      {
        type: "at-keyword",
        value: "@media",
        startIndex: 4,
        endIndex: 10,
      },
      { type: "string", value: "screen", startIndex: 11, endIndex: 17 },
      { type: "at-word", value: "and", startIndex: 18, endIndex: 21 },
      {
        type: "at-open-parenthesis",
        value: "(",
        startIndex: 22,
        endIndex: 23,
      },
      {
        type: "property",
        value: "width",
        startIndex: 23,
        endIndex: 28,
      },
      { type: "at-operator", value: ">", startIndex: 29, endIndex: 30 },
      { type: "at-operator", value: "=", startIndex: 30, endIndex: 31 },
      { type: "numeric", value: "500px", startIndex: 32, endIndex: 37 },
      {
        type: "at-close-parenthesis",
        value: ")",
        startIndex: 37,
        endIndex: 38,
      },
      { type: "at-word", value: "and", startIndex: 39, endIndex: 42 },
      {
        type: "at-open-parenthesis",
        value: "(",
        startIndex: 43,
        endIndex: 44,
      },
      {
        type: "property",
        value: "width",
        startIndex: 44,
        endIndex: 49,
      },
      { type: "colon", value: ":", startIndex: 49, endIndex: 50 },
      { type: "string", value: "auto", startIndex: 51, endIndex: 55 },
      {
        type: "at-close-parenthesis",
        value: ")",
        startIndex: 55,
        endIndex: 56,
      },
      {
        type: "open-curly-bracket",
        value: "{",
        startIndex: 57,
        endIndex: 58,
      },
      {
        type: "classname",
        value: "article",
        startIndex: 63,
        endIndex: 70,
      },
      {
        type: "open-curly-bracket",
        value: "{",
        startIndex: 71,
        endIndex: 72,
      },
      {
        type: "property",
        value: "display",
        startIndex: 79,
        endIndex: 86,
      },
      { type: "colon", value: ":", startIndex: 86, endIndex: 87 },
      { type: "string", value: "flex", startIndex: 88, endIndex: 92 },
      { type: "end-of-line", value: ";", startIndex: 92, endIndex: 93 },
      {
        type: "property",
        value: "color",
        startIndex: 100,
        endIndex: 105,
      },
      { type: "colon", value: ":", startIndex: 105, endIndex: 106 },
      {
        type: "color",
        value: "aliceblue",
        startIndex: 107,
        endIndex: 116,
      },
      {
        type: "end-of-line",
        value: ";",
        startIndex: 116,
        endIndex: 117,
      },
      { type: "unknown", value: "a", startIndex: 124, endIndex: 125 },
      {
        type: "close-curly-bracket",
        value: "}",
        startIndex: 130,
        endIndex: 131,
      },
      {
        type: "close-curly-bracket",
        value: "}",
        startIndex: 134,
        endIndex: 135,
      },
    ],
    startOffset: 4,
    endOffset: 135,
  },
];

test({
  name: "test create parsed file",
  fn: () => {
    const sections = getDynaticCSSTextToParse({
      text,
      identifiers: ["dynatic"],
    });

    const parsedFile = createParsedFile({
      remainingText: text,
      fileStartOffset: 0,
      sections,
    });

    expect({ value: parsedFile }).toEqual({ expected: expectedParsedFile });
    expect({ value: parsedFile.length }).toBe({ expected: 1 });
  },
});

test({
  name: "test get current offset tokens",
  fn: () => {
    const currentSection = expectedParsedFile.find(
      (section) => section.startOffset <= offset && offset <= section.endOffset,
    );

    if (!currentSection) {
      expect({ value: offset }).toNotBeBetween({
        from: expectedParsedFile[0].startOffset,
        to: expectedParsedFile[0].endOffset,
      });
      return;
    }

    const { tokens } = currentSection;

    const parsed = getCurrentOffsetTokens({ offset, tokens, value: "a" });
    expect({ value: parsed }).toEqual({
      expected: { currentToken: { type: "unknown", value: "a", startIndex: 124, endIndex: 125 } },
    });

    const parsedProperty = getCurrentOffsetTokens({ offset: 105, tokens, value: "color" });
    expect({ value: parsedProperty }).toEqual({
      expected: {
        currentToken: { type: "colon", value: ":", startIndex: 105, endIndex: 106 },
        propertyToken: {
          type: "property",
          value: "color",
          startIndex: 100,
          endIndex: 105,
        },
      },
    });

    const parsedPrevious = getCurrentOffsetTokens({ offset: 79, tokens, value: "d" });
    console.dir(parsedPrevious, { depth: null });
  },
});
