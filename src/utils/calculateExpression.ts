import { Operation } from "types/calcTypes";

export const calculateExpression = (operations: Operation[]): number => {
  if (!operations.length) return 0;

  const ops = operations.map((op) => ({ ...op }));
  const calculateOps = (ops: Operation[]): number => {
    for (let i = 0; i < ops.length; i++) {
      if (ops[i].operator === "X" || ops[i].operator === "/") {
        const current = ops[i].value;
        const prev = ops[i - 1].value;

        if (ops[i].operator === "X") {
          ops[i - 1].value = prev * current;
        } else {
          if (current === 0) throw new Error("Division by zero");
          ops[i - 1].value = prev / current;
        }

        ops.splice(i, 1);
        i--;
      }
    }

    let result = ops[0].value;
    for (let i = 1; i < ops.length; i++) {
      result += ops[i].value;
    }

    return result;
  };

  const parseExpression = (ops: Operation[]): number => {
    let i = 0;
    while (i < ops.length) {
      if (ops[i].operator === "(") {
        let j = i + 1;
        let depth = 1;
        while (j < ops.length && depth > 0) {
          if (ops[j].operator === "(") depth++;
          if (ops[j].operator === ")") depth--;
          j++;
        }
        if (depth === 0) {
          const subOps = ops.slice(i + 1, j - 1);
          const subResult = parseExpression(subOps);
          ops.splice(i, j - i, { operator: "", value: subResult });
        } else {
          throw new Error("Mismatched parentheses");
        }
      } else {
        i++;
      }
    }
    return calculateOps(ops);
  };

  return parseExpression(ops);
};
