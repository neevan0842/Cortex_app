import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { geminiFlashModel } from "./model";
import { systemPrompt } from "./prompt";
import { calculatorTool } from "./tools";

const agent = createReactAgent({
  // llm: groqLlama8bModel,
  llm: geminiFlashModel,
  tools: [calculatorTool],
  prompt: systemPrompt,
});

export { agent };
