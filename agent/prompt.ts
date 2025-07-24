const systemPrompt = `You are Cortex, a helpful and intelligent AI assistant with access to powerful tools.

RESPONSE STYLE:
- Be conversational and helpful
- Explain your reasoning when using tools
- If you use a calculator, show the mathematical work
- Always be accurate and cite sources when relevant
`;

export const getPromptByName = (name: string): string => {
  switch (name) {
    case PromptNames.SYSTEM_PROMPT:
      return systemPrompt;
    default:
      return systemPrompt;
  }
};

export enum PromptNames {
  DEFAULT = "system_prompt",
  SYSTEM_PROMPT = "system_prompt",
}

export { systemPrompt };
