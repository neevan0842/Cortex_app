import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import "dotenv/config";

const groqLlama8bModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0,
  maxRetries: 2,
});

const groqLlama70bModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxRetries: 2,
});

const geminiProModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-pro",
});

const geminiFlashModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash-lite",
});

export function getModelByName(modelName: string) {
  switch (modelName) {
    case ModelNames.GROQ_LLM_8B:
      return groqLlama8bModel;
    case ModelNames.GROQ_LLM_70B:
      return groqLlama70bModel;
    case ModelNames.GEMINI_PRO:
      return geminiProModel;
    case ModelNames.GEMINI_FLASH:
      return geminiFlashModel;
    default:
      return groqLlama8bModel;
  }
}

export enum ModelNames {
  DEFAULT = "llama-3.1-8b-instant",
  GROQ_LLM_8B = "groq-llama-3.1-8b-instant",
  GROQ_LLM_70B = "groq-llama-3.3-70b-versatile",
  GEMINI_PRO = "gemini-2.5-pro",
  GEMINI_FLASH = "gemini-2.5-flash-lite",
}

export {
  geminiFlashModel,
  geminiProModel,
  groqLlama70bModel,
  groqLlama8bModel,
};
