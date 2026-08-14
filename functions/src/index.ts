import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { genkit, z } from "genkit";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

// Initialize Firebase Admin SDK
initializeApp();
export const db = getFirestore();

// Secret configuration for Gemini API key
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// Genkit AI instance configuration
const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

/**
 * Genkit Flow: Historical & Civilization Triangulation Query
 */
export const synthesizeCivilizationQuery = ai.defineFlow(
  {
    name: "synthesizeCivilizationQuery",
    inputSchema: z.object({
      query: z.string(),
      civilizationFilter: z.string().optional(),
    }),
    outputSchema: z.object({
      answer: z.string(),
      epistemicClassification: z.enum([
        "ESTABLISHED",
        "SCHOLARLY_DEBATE",
        "TRADITION",
        "ESOTERIC",
        "SPECULATIVE",
        "FICTIONAL",
      ]),
      confidence: z.number(),
    }),
  },
  async ({ query, civilizationFilter }) => {
    const prompt = `You are the HoloKai Oracle AI. Analyze the following query from an African & Classical historical perspective.
Filter: ${civilizationFilter || "Global"}
Query: ${query}

Provide a grounded response with epistemic confidence.`;

    const { text } = await ai.generate(prompt);

    return {
      answer: text,
      epistemicClassification: "ESTABLISHED" as const,
      confidence: 0.95,
    };
  }
);

/**
 * HTTPS Callable Function: Oracle Synthesis API
 * Enforces authenticated users and accesses the GEMINI_API_KEY secret
 */
export const oracleQuery = onCall(
  {
    secrets: [geminiApiKey],
    cors: true,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The oracleQuery function requires user authentication."
      );
    }

    const { query, civilizationFilter } = request.data || {};
    if (!query || typeof query !== "string") {
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with a 'query' string parameter."
      );
    }

    const result = await synthesizeCivilizationQuery({
      query,
      civilizationFilter,
    });

    return result;
  }
);

/**
 * General HTTPS Callable Function: Health Check & Telemetry
 */
export const holokaiHealthCheck = onCall(
  { cors: true },
  async (request) => {
    return {
      status: "online",
      project: "gen-lang-client-0948281794",
      timestamp: new Date().toISOString(),
      authenticated: !!request.auth,
      userUid: request.auth?.uid || null,
    };
  }
);

/**
 * Mock HTTPS Callable: Scan Realms (Domain Search)
 */
export const scanRealms = onCall(
  { cors: true },
  async (request) => {
    const { query } = request.data || {};
    // Mock response simulating a planetary namespace scan
    return {
      results: [
        { name: `${query}.holo`, available: true, price: "$12/yr" },
        { name: `${query}.nexus`, available: false, price: null },
        { name: `${query}.sys`, available: true, price: "$40/yr" },
      ]
    };
  }
);

/**
 * Mock HTTPS Callable: Create Requisition (Checkout/Cart)
 */
export const createRequisition = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Citizen identity required for requisition.");
    }
    const { items } = request.data || {};
    
    // Mock checkout session creation
    return {
      requisitionId: `REQ-${Date.now()}`,
      status: "pending_approval",
      paymentUrl: "https://mock-checkout.holokai.systems",
      itemsProcessed: items?.length || 0
    };
  }
);

/**
 * Mock HTTPS Callable: Get Citizen Profile (Account)
 */
export const getCitizenProfile = onCall(
  { cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Identity verification required.");
    }
    
    // Mock user profile
    return {
      uid: request.auth.uid,
      rank: "Vanguard Initiate",
      clearanceLevel: 2,
      activeRealms: 3,
      lastTransmission: new Date().toISOString()
    };
  }
);
