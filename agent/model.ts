import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY });

export async function convertSpeechToText(audioUri: string): Promise<string> {
  try {
    // Create FormData for the transcription request
    const formData = new FormData();

    // Add the audio file
    formData.append("file", {
      uri: audioUri,
      type: "audio/m4a",
      name: "recording.m4a",
    } as any);

    // Add required parameters
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("temperature", "0");
    formData.append("response_format", "json");
    formData.append("language", "en");

    // Make the transcription request
    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const transcriptionResult = await response.json();
    const transcriptionText = transcriptionResult.text;

    return transcriptionText || "Could not transcribe audio";
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error(
      `Failed to transcribe audio: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Converts text to speech using Groq's TTS API
 * @param text - The text to convert to speech
 * @param voice - The voice to use (default: "Fritz-PlayAI")
 * @param model - The TTS model to use (default: "playai-tts")
 * @returns Promise<string> - The URI of the generated audio file
 */
export async function convertTextToSpeech(
  text: string,
  voice: string = "Fritz-PlayAI",
  model: string = "playai-tts"
): Promise<string> {
  // Use XMLHttpRequest directly since fetch doesn't handle binary properly in RN
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.groq.com/openai/v1/audio/speech");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "arraybuffer"; // This is key for binary data

    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          // Convert ArrayBuffer to base64
          const bytes = new Uint8Array(xhr.response);
          let binary = "";
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64Audio = btoa(binary);
          const audioDataUri = `data:audio/wav;base64,${base64Audio}`;

          resolve(audioDataUri);
        } catch (conversionError) {
          console.error("Failed to convert audio data:", conversionError);
          reject(new Error(`Failed to convert audio data: ${conversionError}`));
        }
      } else {
        console.error(`TTS API error: ${xhr.status} ${xhr.statusText}`);
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = function () {
      console.error("Network error occurred during TTS request");
      reject(new Error("Network error occurred"));
    };

    xhr.ontimeout = function () {
      console.error("TTS request timed out");
      reject(new Error("Request timed out"));
    };

    xhr.timeout = 30000; // 30 second timeout

    xhr.send(
      JSON.stringify({
        model: model,
        input: text,
        voice: voice,
        response_format: "wav",
      })
    );
  });
}

const groqLlama8bModel = new ChatGroq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0,
  maxRetries: 2,
});

const groqLlama70bModel = new ChatGroq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  maxRetries: 2,
});

const geminiProModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  model: "gemini-2.5-pro",
});

const geminiFlashModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
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
  GROQ_LLM_8B = "llama-3.1-8b-instant",
  GROQ_LLM_70B = "llama-3.3-70b-versatile",
  GEMINI_PRO = "gemini-2.5-pro",
  GEMINI_FLASH = "gemini-2.5-flash-lite",
}

export interface Model {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_MODELS: Model[] = [
  {
    id: ModelNames.GROQ_LLM_8B,
    name: "Llama 3.1 8B (Groq)",
    description: "Fast and efficient",
  },
  {
    id: ModelNames.GROQ_LLM_70B,
    name: "Llama 3.3 70B (Groq)",
    description: "Most capable model",
  },
  {
    id: ModelNames.GEMINI_PRO,
    name: "Gemini 2.5 Pro (Google)",
    description: "Advanced complex tasks",
  },
  {
    id: ModelNames.GEMINI_FLASH,
    name: "Gemini 2.5 Flash (Google)",
    description: "Speed optimized",
  },
];

export {
  geminiFlashModel,
  geminiProModel,
  groqLlama70bModel,
  groqLlama8bModel,
};
