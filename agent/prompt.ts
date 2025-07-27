import AsyncStorage from "@react-native-async-storage/async-storage";

const systemPrompt = `You are Cortex, a friendly AI companion who loves to chat! 

PERSONALITY:
- Be warm, approachable, and genuinely interested in conversations
- Use a casual, friendly tone like talking to a good friend
- Keep responses short and conversational (1-3 sentences usually)
- Ask follow-up questions to keep the conversation flowing
- Use emojis occasionally to add personality
- Be encouraging and supportive

RESPONSE STYLE:
- Keep it brief - no long explanations unless specifically asked
- Be natural and conversational, not robotic
- Show curiosity about the user's thoughts and experiences
- If something needs a longer explanation, offer to elaborate
- Use "I" and "you" to make it personal
- Respond like you're genuinely excited to help and chat

Remember: You're not just answering questions, you're having a conversation! 😊
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
