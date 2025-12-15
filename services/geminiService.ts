import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInventory = async (items: InventoryItem[]): Promise<string> => {
  try {
    const summary = items.map(i => {
      // Fix: Handle both User (username) and Player (name) types for obtainedBy
      const obtainedByName = 'name' in i.obtainedBy ? i.obtainedBy.name : i.obtainedBy.username;
      return `- ${i.name} (${i.category}, ${i.rarity}): ${i.quantity} unidades (Obtenido por: ${obtainedByName})`;
    }).join('\n');

    const prompt = `
      Actúa como un "Maestro de Gremio" experto en logística de juegos RPG.
      Analiza el siguiente inventario del gremio:
      
      ${summary}

      Por favor, genera un informe breve y estratégico (máximo 3 párrafos) que cubra:
      1. ¿Estamos bien abastecidos de consumibles para una batalla grande?
      2. ¿Quién es el jugador que más aporta ítems de alto valor?
      3. ¿Qué categoría de recursos nos falta?
      
      Usa un tono épico pero informativo.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error analyzing inventory:", error);
    return "El oráculo está nublado (Error de conexión con la IA). Verifica tu API Key.";
  }
};