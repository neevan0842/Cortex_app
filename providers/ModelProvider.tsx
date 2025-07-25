import { getModelByName, ModelNames } from "@/agent/model";
import { getPromptByName, PromptNames } from "@/agent/prompt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type ModelContextType = {
  model: string;
  prompt: string;
  setModel: (model: string) => void;
  setPrompt: (prompt: string) => void;
  generateLLMResponse: (messages: string) => Promise<string>;
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
});

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [llm, setLLM] = useState<any>(null); // TODO: Define llm type
  const [model, setModel] = useState<string>(ModelNames.DEFAULT);
  const [prompt, setPrompt] = useState<string>(PromptNames.DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const savedModel = await AsyncStorage.getItem("model");
        const savedPrompt = await AsyncStorage.getItem("prompt");

        setModel(savedModel || ModelNames.DEFAULT);
        setPrompt(savedPrompt || PromptNames.DEFAULT);
        console.log("loaded model:", savedModel, "prompt:", savedPrompt);
      } catch (error) {
        console.error("Error loading model:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const updateModel = async () => {
      setIsLoading(true);
      const modelInstance = getModelByName(model);
      await AsyncStorage.setItem("model", model);
      setLLM(modelInstance);
      console.log("ModelProvider - updating model:", model);
      setIsLoading(false);
    };
    updateModel();
  }, [model]);

  useEffect(() => {
    const updatePrompt = async () => {
      await AsyncStorage.setItem("prompt", prompt);
      console.log("ModelProvider - updating prompt:", prompt);
    };
    updatePrompt();
  }, [prompt]);

  const generateLLMResponse = async (message: string): Promise<string> => {
    try {
      if (!llm) {
        console.error("LLM is not initialized");
        return "Error: LLM is not initialized";
      }

      const currentPrompt = getPromptByName(prompt);
      const response = await llm.invoke([
        { role: "system", content: currentPrompt },
        { role: "user", content: message.trim() },
      ]);
      return response.content;
    } catch (error) {
      console.error("Error generating LLM response:", error);
      return "Error generating response";
    }
  };

  return isLoading ? null : (
    <ModelContext.Provider
      value={{
        model,
        prompt,
        setModel,
        setPrompt,
        generateLLMResponse,
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
