import { tool } from "@langchain/core/tools";
import { z } from "zod";

const calculatorTool = tool(
  async (input: { expression: string }) => {
    try {
      // Sanitize the expression to prevent code injection
      const sanitized = input.expression.replace(/[^0-9+\-*/().\s]/g, "");

      if (!sanitized || sanitized.trim() === "") {
        return "Error: Invalid expression. Please provide a valid mathematical expression.";
      }

      // Use Function constructor for safe evaluation (better than eval)
      const result = new Function(`"use strict"; return (${sanitized})`)();

      if (typeof result !== "number" || !isFinite(result)) {
        return "Error: Invalid calculation result.";
      }

      return `${input.expression} = ${result}`;
    } catch (error) {
      return `Error: Invalid mathematical expression. ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
  {
    name: "calculator",
    description: `Perform mathematical calculations and solve arithmetic expressions.
    
    This tool can evaluate mathematical expressions including basic arithmetic 
    operations, parentheses, and decimal numbers.
    
    Args:
        expression (str): The mathematical expression to evaluate. Supports:
                         - Basic operations: +, -, *, /
                         - Parentheses for grouping: ()
                         - Decimal numbers: 3.14, 0.5
                         - Negative numbers: -5, -3.2
    
    Returns:
        str: The calculation result formatted as "expression = result" or an error message.
    
    Examples:
        - "2 + 3 * 4"
        - "(10 - 5) / 2"
        - "3.14 * 2"
        - "100 / 3"
    `,
    schema: z.object({
      expression: z
        .string()
        .describe("The mathematical expression to calculate"),
    }),
  }
);

export { calculatorTool };
