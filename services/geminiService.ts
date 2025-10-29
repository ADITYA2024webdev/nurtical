
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";
import type { AnalysisResult, ChatMessage, Source } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        mealName: { type: Type.STRING, description: "A concise name for the meal." },
        description: { type: Type.STRING, description: "A short, engaging description of the meal." },
        totalCalories: { type: Type.INTEGER, description: "Estimated total calories for the entire meal." },
        macros: {
            type: Type.OBJECT,
            properties: {
                protein: { type: Type.NUMBER, description: "Grams of protein." },
                carbohydrates: { type: Type.NUMBER, description: "Grams of carbohydrates." },
                fat: { type: Type.NUMBER, description: "Grams of fat." },
            },
            required: ["protein", "carbohydrates", "fat"]
        },
        micronutrients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the vitamin or mineral." },
                    amount: { type: Type.NUMBER, description: "Amount of the nutrient." },
                    unit: { type: Type.STRING, description: "Unit of measurement (e.g., mg, mcg, IU)." }
                },
                required: ["name", "amount", "unit"]
            }
        },
        novaScore: { type: Type.INTEGER, description: "NOVA score for food processing (1-4)." },
        healthScore: { type: Type.INTEGER, description: "An overall health score from 1-100." },
        healthTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable health tips related to the meal."
        }
    },
    required: ["mealName", "description", "totalCalories", "macros", "micronutrients", "novaScore", "healthScore", "healthTips"]
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: mimeType,
                data: base64Image,
            },
        };

        const textPart = {
            text: "Analyze this meal photo. Provide a detailed nutritional breakdown, including calories, macros (protein, carbs, fat), key micronutrients, a NOVA score, a general health score out of 100, and some brief health tips. Respond in the requested JSON format."
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image. The AI model may be unable to process this specific image.");
    }
};


export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          tools: [{googleSearch: {}}],
        },
        systemInstruction: "You are Nutri-Chat, an expert AI nutritionist. Provide helpful, safe, and evidence-based advice. Use Google Search to find up-to-date information when needed. You are not a medical doctor and should always advise users to consult a professional for medical advice."
    });
};

export const sendMessageStream = async (chat: Chat, message: string, onChunk: (chunkText: string, sources?: Source[]) => void) => {
    const stream = await chat.sendMessageStream({ message });
    let sourcesFound: Source[] | undefined = undefined;

    for await (const chunk of stream) {
        const chunkText = chunk.text;
        
        const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
        if (groundingMetadata?.groundingChunks) {
            const webChunks = groundingMetadata.groundingChunks
                .map(c => c.web)
                .filter((web): web is { uri: string; title: string } => !!web);
            if(webChunks.length > 0) {
                sourcesFound = webChunks.map(web => ({ uri: web.uri, title: web.title }));
            }
        }
        onChunk(chunkText, sourcesFound);
    }
};
