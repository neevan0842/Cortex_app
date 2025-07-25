import AsyncStorage from "@react-native-async-storage/async-storage";

const systemPrompt = `You are Cortex, a helpful and intelligent AI assistant with access to powerful tools.

RESPONSE STYLE:
- Be conversational and helpful
- Explain your reasoning when using tools
- If you use a calculator, show the mathematical work
- Always be accurate and cite sources when relevant
`;

export const getPromptByName = async (name: string): Promise<string> => {
  switch (name) {
    case PromptNames.SYSTEM_PROMPT:
      return systemPrompt;
    case PromptNames.CUSTOM_PROMPT:
      return (await AsyncStorage.getItem(PromptNames.CUSTOM_PROMPT)) || "";
    default:
      return systemPrompt;
  }
};

export interface Prompt {
  id: string;
  name: string;
  description: string;
}

export enum PromptNames {
  DEFAULT = "system_prompt",
  SYSTEM_PROMPT = "system_prompt",
  CUSTOM_PROMPT = "custom_prompt",
}

export const AVAILABLE_PROMPTS: Prompt[] = [
  {
    id: PromptNames.SYSTEM_PROMPT,
    name: "System Prompt",
    description: systemPrompt,
  },
  {
    id: PromptNames.CUSTOM_PROMPT,
    name: "Custom Prompt",
    description: "",
  },
];

export { systemPrompt };
