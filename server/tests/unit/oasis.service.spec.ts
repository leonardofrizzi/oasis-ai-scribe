import { extractOasisFields } from "../../src/services/oasis.service";

describe("extractOasisFields", () => {
  it("should return keys M1800–M1860 with empty string values", () => {
    const transcript = "some random text";
    const result = extractOasisFields(transcript);

    expect(Object.keys(result)).toEqual([
      "M1800",
      "M1810",
      "M1820",
      "M1830",
      "M1840",
      "M1850",
      "M1860",
    ]);

    for (const key of Object.keys(result)) {
      expect(result[key]).toBe("");
    }
  });
});