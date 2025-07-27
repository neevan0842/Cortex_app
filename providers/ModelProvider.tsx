import { getModelByName, ModelNames } from "@/agent/model";
import { getPromptByName, PromptNames } from "@/agent/prompt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type ConversationMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

type ModelContextType = {
  model: string;
  prompt: string;
  setModel: (model: string) => void;
  setPrompt: (prompt: string) => void;
  generateLLMResponse: (message: string) => Promise<string>;
  conversationHistory: ConversationMessage[];
  clearConversation: () => void;
  getConversationHistory: () => ConversationMessage[];
};

interface ModelProviderProps {
  children: React.ReactNode;
}

export const ModelContext = createContext<ModelContextType>({
  model: ModelNames.DEFAULT,
  prompt: PromptNames.DEFAULT,
  setModel: () => {},
  setPrompt: () => {},
  generateLLMResponse: () => Promise.resolve(""),
  conversationHistory: [],
  clearConversation: () => {},
  getConversationHistory: () => [],
});

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [llm, setLLM] = useState<any>(null); // TODO: Define llm type
  const [model, setModel] = useState<string>(ModelNames.DEFAULT);
  const [prompt, setPrompt] = useState<string>(PromptNames.DEFAULT);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);

  // Load data from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedModel = await AsyncStorage.getItem("model");
        const savedPrompt = await AsyncStorage.getItem("prompt");
        const savedHistory = await AsyncStorage.getItem("conversationHistory");

        setModel(savedModel || ModelNames.DEFAULT);
        setPrompt(savedPrompt || PromptNames.DEFAULT);

        if (savedHistory) {
          try {
            const parsedHistory = JSON.parse(savedHistory);
            setConversationHistory(parsedHistory);
          } catch (parseError) {
            console.error("Error parsing conversation history:", parseError);
            setConversationHistory([]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  // Save conversation history when it changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem(
          "conversationHistory",
          JSON.stringify(conversationHistory)
        );
      } catch (error) {
        console.error("Error saving conversation history:", error);
      }
    };

    if (conversationHistory.length > 0) {
      saveHistory();
    }
  }, [conversationHistory]);

  // Conversation management functions
  const clearConversation = async () => {
    setConversationHistory([]);
    try {
      await AsyncStorage.removeItem("conversationHistory");
    } catch (error) {
      console.error("Error clearing conversation history:", error);
    }
  };

  const getConversationHistory = () => {
    return conversationHistory;
  };

  const addToConversation = (message: ConversationMessage) => {
    setConversationHistory((prev) => [
      ...prev,
      {
        ...message,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    const updateModel = async () => {
      const modelInstance = getModelByName(model);
      await AsyncStorage.setItem("model", model);
      setLLM(modelInstance);
    };
    updateModel();
  }, [model]);

  useEffect(() => {
    const updatePrompt = async () => {
      await AsyncStorage.setItem("prompt", prompt);
    };
    updatePrompt();
  }, [prompt]);

  const generateLLMResponse = async (message: string): Promise<string> => {
    try {
      if (!llm) {
        console.error("LLM is not initialized");
        return "Error: LLM is not initialized";
      }

      const currentPrompt = await getPromptByName(prompt);

      // Build conversation context with history
      const messages: ConversationMessage[] = [
        { role: "system", content: currentPrompt },
      ];

      // Add conversation history (limit to last 10 exchanges to manage context length)
      const recentHistory = conversationHistory.slice(-20); // Last 20 messages (10 exchanges)
      messages.push(...recentHistory);

      // Add current user message
      const userMessage: ConversationMessage = {
        role: "user",
        content: message.trim(),
      };
      messages.push(userMessage);

      // Generate response
      const response = await llm.invoke(messages);
      const assistantResponse = response.content;

      // Add both user message and assistant response to conversation history
      addToConversation(userMessage);
      addToConversation({
        role: "assistant",
        content: assistantResponse,
      });

      return assistantResponse;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      return "Error generating response";
    }
  };

  return (
    <ModelContext.Provider
      value={{
        model,
        prompt,
        setModel,
        setPrompt,
        generateLLMResponse,
        conversationHistory,
        clearConversation,
        getConversationHistory,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(ModelContext);
  return context;
};
