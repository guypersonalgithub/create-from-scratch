import { describe, it, expect } from "vitest";
import { convertObjectToYaml } from "../src";

describe("convertObjectToYaml", () => {
  it("should convert a simple object to YAML", () => {
    const input = { key: "value" };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("key: value\n");
  });

  it("should handle nested objects", () => {
    const input = { parent: { child: "value" } };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("parent:\n  child: value\n");
  });

  it("should handle arrays of primitives", () => {
    const input = { items: ["one", "two", "three"] };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("items:\n  - one\n  - two\n  - three\n");
  });

  it("should handle arrays of objects", () => {
    const input = { users: [{ name: "Alice" }, { name: "Bob" }] };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("users:\n  - name: Alice\n  - name: Bob\n");
  });

  it("should handle multiline strings", () => {
    const input = { description: "line 1\nline 2\nline 3" };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("description: |\n  line 1\n  line 2\n  line 3\n");
  });

  it("should handle run commands", () => {
    const input = { run: "echo hello\necho world" };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("run: |\n  echo hello\n  echo world\n");
  });

  it("should handle empty objects", () => {
    const input = {};
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("");
  });

  it("should handle undefined values", () => {
    const input = { key: undefined };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("key: \n");
  });

  it("should handle numbers", () => {
    const input = { count: 42 };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("count: 42\n");
  });

  it("should handle booleans", () => {
    const input = { active: true, inactive: false };
    const output = convertObjectToYaml({ obj: input });
    expect(output).toBe("active: true\ninactive: false\n");
  });
});
