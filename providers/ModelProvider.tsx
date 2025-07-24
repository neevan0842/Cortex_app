import { getModelByName, ModelNames } from "@/agent/model";
import { getPromptByName, PromptNames } from "@/agent/prompt";
import { getToolsByNames } from "@/agent/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ModelContextType = {
  agent: any; // TODO
  model: string;
  toolNames: string[];
  prompt: string;
  buildAgent: () => Promise<void>;
  setModel: (model: string) => void;
  setToolNames: (toolNames: string[]) => void;
  setPrompt: (prompt: string) => void;
};

interface ModelProviderProps {
  children: React.ReactNode;
}

export const ModelContext = createContext<ModelContextType>({
  agent: null,
  model: ModelNames.DEFAULT,
  toolNames: [],
  prompt: PromptNames.DEFAULT,
  buildAgent: async () => {},
  setModel: () => {},
  setToolNames: () => {},
  setPrompt: () => {},
});

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [agent, setAgent] = useState<any>(null); // TODO: Define agent type
  const [model, setModel] = useState<string>(ModelNames.DEFAULT);
  const [toolNames, setToolNames] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>(PromptNames.DEFAULT);

  // Load data from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedModel = await AsyncStorage.getItem("model");
        const savedToolNamesString = await AsyncStorage.getItem("toolNames");
        const savedPrompt = await AsyncStorage.getItem("prompt");

        // Parse toolNames safely
        let parsedToolNames: string[] = [];
        if (savedToolNamesString) {
          try {
            parsedToolNames = JSON.parse(savedToolNamesString);
            if (!Array.isArray(parsedToolNames)) {
              parsedToolNames = [];
            }
          } catch (error) {
            console.warn("Failed to parse saved toolNames:", error);
            parsedToolNames = [];
          }
        }

        setModel(savedModel || ModelNames.DEFAULT);
        setToolNames(parsedToolNames);
        setPrompt(savedPrompt || PromptNames.DEFAULT);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadData();
  }, []);

  const buildAgent = useCallback(async () => {
    try {
      // Only build if we have valid state
      if (!model || !prompt) {
        console.warn("Cannot build agent: missing model or prompt");
        return;
      }

      const llm = getModelByName(model);
      const tools = getToolsByNames(toolNames);
      const promptTemplate = getPromptByName(prompt);

      // Save to storage
      await AsyncStorage.setItem("model", model);
      await AsyncStorage.setItem("toolNames", JSON.stringify(toolNames));
      await AsyncStorage.setItem("prompt", prompt);

      const currentAgent = createReactAgent({
        llm: llm,
        tools: tools,
        prompt: promptTemplate,
      });

      setAgent(currentAgent);
    } catch (error) {
      console.error("Error building agent:", error);
    }
  }, [model, toolNames, prompt]);

  useEffect(() => {
    buildAgent();
  }, [buildAgent]);

  return (
    <ModelContext.Provider
      value={{
        agent,
        model,
        toolNames,
        prompt,
        buildAgent,
        setModel,
        setToolNames,
        setPrompt,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useAgent must be used within a ModelProvider");
  }
  return context;
};
