import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY as string });
const model = 'gemini-2.5-flash';

export const analyzeBook = async (bookContent: string, userPrompt: string): Promise<string> => {
  const fullPrompt = `You are an expert literary assistant. Your task is to analyze the provided book content and respond to the user's request. Your answers should be comprehensive, well-structured, and in Russian.

  --- BOOK CONTENT START ---
  ${bookContent}
  --- BOOK CONTENT END ---

  User Request: "${userPrompt}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Произошла ошибка при обращении к AI. Пожалуйста, проверьте консоль для получения дополнительной информации или убедитесь, что ваш API-ключ настроен правильно.";
  }
};


export const generateGenresAndTags = async (bookContent: string): Promise<string[]> => {
  const fullPrompt = `Analyze the following book content and generate a list of at least 30 relevant genres and tags. The list should include both broad genres and specific niche tags. Return the result as a JSON array of strings.

  --- BOOK CONTENT START ---
  ${bookContent}
  --- BOOK CONTENT END ---
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    // Basic validation to ensure it's an array of strings
    if (Array.isArray(result) && result.every(item => typeof item === 'string')) {
      return result;
    }
    return [];
  } catch (error) {
    console.error("Error generating genres from Gemini API:", error);
    throw new Error("Не удалось сгенерировать жанры и теги.");
  }
};

export type SummaryResponse = {
  found: boolean;
  title: string | null;
  summary: string | null;
  clarificationNeeded: string | null;
};

export const generateChapterSummary = async (bookContent: string, userClarification: string): Promise<SummaryResponse> => {
  const fullPrompt = `You are a literary analyst AI. Your task is to find a specific scene or chapter in the provided book content based on the user's description and generate a concise summary for it.

  Analyze the book content and the user's request.
  - If you can clearly identify the requested scene, respond with a JSON object where "found" is true, "title" is a short, descriptive title for the scene (in Russian), and "summary" is the generated summary (in Russian).
  - If the user's description is ambiguous or you cannot find a matching scene, respond with a JSON object where "found" is false and "clarificationNeeded" contains a question (in Russian) to the user asking for more specific details (e.g., "Не могли бы вы уточнить, о какой битве идет речь?" or "Я не нашел сцену ссоры. Можете описать ее подробнее?"). Do not invent a summary if you are not sure.

  --- BOOK CONTENT START ---
  ${bookContent}
  --- BOOK CONTENT END ---

  User's description of the scene: "${userClarification}"
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            found: { type: Type.BOOLEAN },
            title: { type: Type.STRING, nullable: true },
            summary: { type: Type.STRING, nullable: true },
            clarificationNeeded: { type: Type.STRING, nullable: true },
          },
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating summary from Gemini API:", error);
    throw new Error("Не удалось сгенерировать резюме главы.");
  }
};

export const generateAnnotation = async (bookContent: string, userFeedback?: string): Promise<string> => {
  const prompt = userFeedback 
    ? `The user provided feedback on the previous annotation. Refine it.
      Previous Annotation: (You have this in your memory from the conversation)
      User Feedback: "${userFeedback}"
      
      Generate a new, improved annotation based on this feedback. The response should be only the annotation text in Russian.`
    : `You are an expert copywriter for a publishing house. Your task is to write a compelling and intriguing annotation for the provided book content. The annotation should be in Russian, around 100-150 words, and should capture the essence of the story without revealing major spoilers.

      --- BOOK CONTENT START ---
      ${bookContent}
      --- BOOK CONTENT END ---
      
      Generate the annotation. The response should be only the annotation text.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating annotation from Gemini API:", error);
    throw new Error("Не удалось сгенерировать аннотацию.");
  }
};