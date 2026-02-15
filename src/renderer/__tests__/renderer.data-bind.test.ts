import { describe, test, expect } from "vitest";
import { resolveValue } from "../renderer.data-bind";

describe("resolveValue", () => {
  const testData = {
    id: "test-id",
    type: "test-type",
    name: "Test Item",
    items: [
      {
        title: "First Item",
        value: "value-1",
        description: "First description",
      },
      {
        title: "Second Item",
        value: "value-2",
        description: "Second description",
      },
    ],
    tags: ["tag-1", "tag-2", "tag-3"],
    metadata: {
      category: "test-category",
      priority: "high",
    },
  };

  describe("Basic property access", () => {
    test("should resolve simple property", () => {
      expect(resolveValue(testData, ".")).toBe(testData);
      expect(resolveValue(testData, ".name")).toBe("Test Item");
      expect(resolveValue(testData, ".type")).toBe("test-type");
      expect(resolveValue(testData, ".id")).toBe("test-id");
      expect(resolveValue(testData, ".items")).toEqual([
        {
          title: "First Item",
          value: "value-1",
          description: "First description",
        },
        {
          title: "Second Item",
          value: "value-2",
          description: "Second description",
        },
      ]);
      expect(resolveValue(testData, ".tags")).toEqual([
        "tag-1",
        "tag-2",
        "tag-3",
      ]);
      expect(resolveValue(testData, ".metadata")).toEqual({
        category: "test-category",
        priority: "high",
      });
    });

    test("should resolve array element by index", () => {
      expect(resolveValue(testData, ".items[0]")).toEqual({
        title: "First Item",
        value: "value-1",
        description: "First description",
      });
      expect(resolveValue(testData, ".items[1]")).toEqual({
        title: "Second Item",
        value: "value-2",
        description: "Second description",
      });
    });

    test("should resolve nested property in array element", () => {
      expect(resolveValue(testData, ".items[0].title")).toBe("First Item");
      expect(resolveValue(testData, ".items[0].value")).toBe("value-1");
      expect(resolveValue(testData, ".items[1].description")).toBe(
        "Second description"
      );
    });

    test("should resolve tags array", () => {
      expect(resolveValue(testData, ".tags[0]")).toBe("tag-1");
      expect(resolveValue(testData, ".tags[1]")).toBe("tag-2");
      expect(resolveValue(testData, ".tags[2]")).toBe("tag-3");
    });

    test("should resolve nested property", () => {
      expect(resolveValue(testData, ".metadata.category")).toBe(
        "test-category"
      );
      expect(resolveValue(testData, ".metadata.priority")).toBe("high");
    });
  });

  describe("Edge cases", () => {
    test("should handle undefined path", () => {
      expect(resolveValue(testData, undefined)).toBeUndefined();
    });

    test("should handle empty string path", () => {
      expect(resolveValue(testData, "")).toBeUndefined();
    });

    test("should handle non-string path", () => {
      expect(resolveValue(testData, null as any)).toBeUndefined();
      expect(resolveValue(testData, 123 as any)).toBeUndefined();
    });

    test("should handle non-existent property", () => {
      expect(resolveValue(testData, ".nonExistent")).toBeUndefined();
      expect(resolveValue(testData, ".items[999]")).toBeUndefined();
    });

    test("should handle non-array access with brackets", () => {
      expect(resolveValue(testData, ".name[0]")).toBeNull();
    });

    test("should handle null/undefined intermediate values", () => {
      const dataWithNull = { nested: null };
      expect(resolveValue(dataWithNull, ".nested.property")).toBeUndefined();
    });
  });
});

