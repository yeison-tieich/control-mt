import { GoogleGenAI, Type } from "@google/genai";
import type { OrdenProduccion } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getPrioritySuggestion = async (orden: OrdenProduccion): Promise<{prioridad: string, justificacion: string}> => {
  try {
    const prompt = `
      Eres un experto en planificación de producción. Analiza la siguiente orden de trabajo y sugiere un nivel de prioridad (Baja, Media, Alta). Justifica tu respuesta en una sola frase corta.
      
      Detalles de la Orden:
      - Producto: ${orden.nombreProducto}
      - Cliente: ${orden.nombreCliente}
      - Cantidad: ${orden.cantidadSolicitada} unidades
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prioridad: {
                type: Type.STRING,
                description: 'Nivel de prioridad sugerido: Baja, Media, o Alta.',
              },
              justificacion: {
                type: Type.STRING,
                description: 'Una frase corta que justifique la prioridad.',
              },
            },
            required: ['prioridad', 'justificacion'],
          },
        }
    });
    
    // Fix: Parse the JSON string response from Gemini to return a structured object.
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error al obtener sugerencia de Gemini:", error);
    throw new Error("No se pudo obtener la sugerencia de la IA.");
  }
};

export const draftClientEmail = async (orden: OrdenProduccion): Promise<string> => {
  try {
    const prompt = `
      Actúa como un asistente de servicio al cliente. Redacta un correo electrónico breve y profesional para el cliente "${orden.nombreCliente}" sobre el estado de su orden de producción.
      
      Detalles de la Orden:
      - ID de Orden: ${orden.id}
      - Producto: ${orden.nombreProducto}
      - Cantidad: ${orden.cantidadSolicitada}
      - Estado Actual: ${orden.estado}
      
      El tono debe ser amigable y eficiente. No incluyas un saludo final (ej. "Atentamente").
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error al redactar email con Gemini:", error);
    throw new Error("No se pudo redactar el borrador del correo.");
  }
};