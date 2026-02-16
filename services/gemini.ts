
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const hasApiKey = () => !!apiKey;

async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isNetworkError = error.message && (error.message.includes('xhr error') || error.message.includes('fetch failed'));
    const isServerError = error.status && error.status >= 500 && error.status < 600;
    
    if ((isNetworkError || isServerError) && retries > 0) {
      console.warn(`Gemini API Error: ${error.message}. Retrying in ${delay}ms... (Attempts left: ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface LandMatch {
  name: string;
  type: string;
  location: string;
  coordinates: { lat: number, lng: number };
  size: string;
  price: string;
  projectedIRR: number;
  matchScore: number;
  reasoning: string;
  zoning: string;
  soilReport: string;
  infrastructure: string[];
}

export interface LandMatchResponse {
  matches: LandMatch[];
  sources: GroundingSource[];
}

export const findLandMatches = async (
  capital: number,
  targetIRR: number,
  type: string
): Promise<LandMatchResponse> => {
  if (!apiKey) return { matches: [], sources: [] };

  let userLocation = null;
  try {
    const pos = await new Promise<GeolocationPosition>((res, rej) => 
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 })
    );
    userLocation = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };
  } catch (e) {
    console.debug("Geolocation not available for toolConfig");
  }

  const prompt = `
    Act as an elite real estate investment AI. 
    The user has ${capital} AED/SAR capital and targets an IRR of ${targetIRR}%.
    They are looking for a "${type}" development opportunity in the Middle East.
    Use Google Maps to find 3 real plot opportunities in Riyadh or Dubai.
    Return strictly a JSON array with the following structure for each match:
    {
      "name": string,
      "type": string,
      "location": string (full address as a single string),
      "coordinates": {"lat": number, "lng": number},
      "size": string,
      "price": string,
      "projectedIRR": number,
      "matchScore": number,
      "reasoning": string,
      "zoning": string,
      "soilReport": string,
      "infrastructure": string[]
    }
    Return ONLY the JSON. No other text.
  `;

  try {
    const response = await retry<GenerateContentResponse>(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
        tools: [{ googleMaps: {} }],
        // responseMimeType: "application/json" // NOT ALLOWED with googleMaps tool
      }
    }));

    if (response.text) {
      // Clean the response text to extract JSON array
      let jsonText = response.text.trim();
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0].trim();
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0].trim();
      }
      
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const rawMatches = JSON.parse(jsonText);
      
      // Crucial: Sanitize data to ensure no objects are passed to JSX components
      const matches: LandMatch[] = rawMatches.map((m: any) => {
        // Handle case where 'location' might be an object {address, latitude, longitude}
        let sanitizedLocation = "Unknown Location";
        if (typeof m.location === 'string') {
          sanitizedLocation = m.location;
        } else if (typeof m.location === 'object' && m.location !== null) {
          sanitizedLocation = m.location.address || m.location.name || JSON.stringify(m.location);
        }

        // Handle infrastructure to ensure it's an array of strings
        const sanitizedInfra = Array.isArray(m.infrastructure) 
          ? m.infrastructure.map((i: any) => typeof i === 'object' ? (i.name || JSON.stringify(i)) : String(i))
          : [];

        return {
          ...m,
          location: sanitizedLocation,
          infrastructure: sanitizedInfra,
          name: String(m.name || "Unnamed Site"),
          type: String(m.type || "Mixed-Use"),
          size: String(m.size || "Unknown Size"),
          price: String(m.price || "Contact for Price"),
          projectedIRR: Number(m.projectedIRR || 0),
          matchScore: Number(m.matchScore || 0),
          reasoning: String(m.reasoning || ""),
          zoning: String(m.zoning || "Pending"),
          soilReport: String(m.soilReport || "N/A"),
          coordinates: m.coordinates || { lat: 24.7136, lng: 46.6753 }
        };
      });

      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.maps) sources.push({ title: chunk.maps.title || "Map Location", url: chunk.maps.uri });
        });
      }
      return { matches, sources };
    }
    return { matches: [], sources: [] };
  } catch (error) {
    console.error("Gemini Data Fetch Error:", error);
    return { matches: [], sources: [] };
  }
};

export interface ComplianceInsight {
  title: string;
  impact: "High" | "Medium" | "Low";
  description: string;
  savingEstimate: string;
}

export const analyzeCompliance = async (
  projectType: string,
  location: string
): Promise<ComplianceInsight[]> => {
  if (!apiKey) return [];
  const prompt = `Analyze regulatory landscape for "${projectType}" in "${location}". Focus on Estidama and White Land Tax. Return 3 JSON insights.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              impact: { type: Type.STRING },
              description: { type: Type.STRING },
              savingEstimate: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text) as ComplianceInsight[];
  } catch (e) { return []; }
};

export interface ProcurementRisk {
  category: string;
  riskLevel: "Critical" | "Stable" | "Warning";
  description: string;
  mitigation: string;
}

export const analyzeProcurementRisk = async (region: string): Promise<ProcurementRisk[]> => {
  if (!apiKey) return [];
  const prompt = `Analyze supply chain risks for construction in ${region} (e.g. Red Sea shipping, SAR/AED currency). Return 3 risk items in JSON format with category, riskLevel (Critical/Stable/Warning), description, and mitigation.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              description: { type: Type.STRING },
              mitigation: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text) as ProcurementRisk[];
  } catch (e) { return []; }
};
