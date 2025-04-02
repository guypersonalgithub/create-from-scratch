import { describe, it, expect } from "vitest";
import { convertYamlToObject } from "../src";

describe("convertYamlToObject", () => {
  it("should convert a simple YAML string to an object", () => {
    const yaml = "key: value";
    const expected = { key: "value" };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should handle multiple key-value pairs", () => {
    const yaml = `
      key1: value1
      key2: value2
    `;
    const expected = { key1: "value1", key2: "value2" };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should parse nested objects", () => {
    const yaml = `
      parent:
        child: value
    `;
    const expected = { parent: { child: "value" } };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should parse lists", () => {
    const yaml = `
      list:
        - item1
        - item2
    `;
    const expected = { list: ["item1", "item2"] };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should parse objects inside lists", () => {
    const yaml = `
      list:
        - key1: value1
          key2: value2
    `;
    const expected = { list: [{ key1: "value1", key2: "value2" }] };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should handle empty values as undefined", () => {
    const yaml = "key:";
    const expected = { key: undefined };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should parse boolean values", () => {
    const yaml = `
      boolTrue: true
      boolFalse: false
    `;
    const expected = { boolTrue: true, boolFalse: false };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should parse numeric values", () => {
    const yaml = `
      number: 123
    `;
    const expected = { number: 123 };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should parse null values", () => {
    const yaml = `
      empty: null
    `;
    const expected = { empty: null };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  it("should ignore comments", () => {
    const yaml = `
      key: value
      # this is a comment
      anotherKey: anotherValue
    `;
    const expected = { key: "value", anotherKey: "anotherValue" };
    expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  });

  // it("should parse multiline strings", () => {
  //   const yaml = `
  //     description: |
  //       This is a
  //       multiline string.
  //   `;
  //   const expected = { description: "This is a\nmultiline string." };
  //   expect(convertYamlToObject({ str: yaml })).toEqual(expected);
  // });
});
