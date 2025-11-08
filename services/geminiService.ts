import { GoogleGenAI, Type } from "@google/genai";
import type { OrdenProduccion } from "../types";

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPrioritySuggestion = async (orden: OrdenProduccion): Promise<{prioridad: string, justificacion: string}> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Analiza la siguiente orden de producción y sugiere una prioridad (Baja, Media, Alta).
    Devuelve la respuesta en formato JSON con las claves "prioridad" y "justificacion".

    - Producto: ${orden.descripcion}
    - Cliente: ${orden.cliente}
    - Cantidad: ${orden.cantidad_unidades}
    - Fecha de Emisión: ${orden.fecha_emision}
    - Estado Actual: ${orden.estado}
    - Prioridad Actual: ${orden.prioridad}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prioridad: { type: Type.STRING },
          justificacion: { type: Type.STRING },
        },
        required: ['prioridad', 'justificacion']
      },
    },
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Error al parsear la respuesta JSON de Gemini:", e);
    throw new Error("La respuesta de la IA no es un JSON válido.");
  }
};

export const draftClientEmail = async (orden: OrdenProduccion): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Redacta un correo electrónico corto y profesional para el cliente "${orden.cliente}" 
    informándole sobre el estado actual de su orden de producción #${orden.no_ot}.

    Detalles de la orden:
    - Producto: ${orden.descripcion}
    - Cantidad: ${orden.cantidad_unidades}
    - Estado Actual: ${orden.estado}

    Sé amable y conciso. No incluyas un asunto, solo el cuerpo del correo.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });
  
  return response.text;
};

export const generateJobDescription = async (cargo: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Genera una descripción de responsabilidades breve (2-3 frases) para el cargo de "${cargo}" 
    en una empresa de manufactura de productos de madera y metal.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};
