
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performResearch = async (query: string, systemInstruction: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No response generated.";
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Source",
    uri: chunk.web?.uri || "#"
  })) || [];

  return { text, sources };
};

export const generateStrategicImage = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `High-quality, professional conceptual image for: ${prompt}. Cinematic, detailed, corporate style.` }]
    },
    config: {
      imageConfig: { aspectRatio: "16:9" }
    }
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};

export const predictOutcomes = async (stats: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze these statistics and provide a structured recap, predictions, and viability analysis: ${stats}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recap: { type: Type.STRING },
          predictions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of predicted outcomes as strings." 
          },
          viabilityRating: { type: Type.NUMBER },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of strategic recommendations as strings."
          }
        },
        required: ["recap", "predictions", "viabilityRating", "recommendations"]
      },
      systemInstruction: "You are a world-class data scientist and strategist. Provide data-driven insights."
    }
  });
  
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse prediction response", e);
    return null;
  }
};

export const generateRoadmap = async (objective: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed strategic roadmap for: ${objective}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING }
              }
            }
          },
          riskAssessment: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
