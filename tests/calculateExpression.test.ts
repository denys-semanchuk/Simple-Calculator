
import { calculateExpression } from "../src/utils/handlers";
import { Operation } from "../src/types/calcTypes"; // Assuming you have types defined

describe("calculateExpression", () => {
  test("should perform basic addition", () => {
    const operations: Operation[] = [
      { value: 5, operator: "+" },
      { value: 3, operator: "+" },
    ];
    expect(calculateExpression(operations)).toBe(8);
  });

  test("should perform basic subtraction", () => {
    const operations: Operation[] = [
      { value: 10, operator: "+" },
      { value: 4, operator: "-" },
    ];
    expect(calculateExpression(operations)).toBe(6);
  });

  test("should handle multiplication", () => {
    const operations: Operation[] = [
      { value: 2, operator: "+" },
      { value: 3, operator: "X" },
    ];
    expect(calculateExpression(operations)).toBe(6);
  });

  test("should handle division", () => {
    const operations: Operation[] = [
      { value: 10, operator: "+" },
      { value: 2, operator: "/" },
    ];
    expect(calculateExpression(operations)).toBe(5);
  });

  test("should throw error on division by zero", () => {
    const operations: Operation[] = [
      { value: 10, operator: "+" },
      { value: 0, operator: "/" },
    ];
    expect(() => calculateExpression(operations)).toThrow("Division by zero");
  });

  test("should respect order of operations", () => {
    const operations: Operation[] = [
      { value: 2, operator: "+" },
      { value: 3, operator: "X" },
      { value: 4, operator: "+" },
      { value: 2, operator: "-" },
    ];
    // Should calculate: 2 + (3 * 4) - 2 = 2 + 12 - 2 = 12
    expect(calculateExpression(operations)).toBe(12);
  });

  test("should handle complex expressions", () => {
    const operations: Operation[] = [
      { value: 10, operator: "+" },
      { value: 5, operator: "X" },
      { value: 2, operator: "/" },
      { value: 3, operator: "-" },
    ];
    // Should calculate: 10 + (5 * 2) / 2 - 3 = 10 + 5 - 3 = 12
    expect(calculateExpression(operations)).toBe(12);
  });
});
