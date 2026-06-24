/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dns from "dns";

// Fix Node.js DNS pathing issue inside some containers
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to safely get the Gemini API client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

/**
 * Endpoint for AI Incident Safety Assessment
 * Uses gemini-3.5-flash to classify incident category, detect spam/fake reports,
 * analyze emotional sentiment, and provide developer-grade confidence logs.
 */
app.post("/api/analyze-incident", async (req, res) => {
  const { description } = req.body;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "Description must be a valid non-empty string" });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Graceful fallback for demo when API key is missing
    const descriptionLower = description.toLowerCase();
    let suggestedCategory = "other";
    let sentiment: "neutral" | "angry" | "fearful" | "distressed" | "hostile" = "distressed";
    let toxicityScore = 0.2;
    let isLikelyFake = false;

    if (descriptionLower.includes("overcharge") || descriptionLower.includes("money") || descriptionLower.includes("price")) {
      suggestedCategory = "overcharging";
      sentiment = "angry";
      toxicityScore = 0.45;
    } else if (descriptionLower.includes("weapon") || descriptionLower.includes("steal") || descriptionLower.includes("rob")) {
      suggestedCategory = "theft";
      sentiment = "fearful";
      toxicityScore = 0.8;
    } else if (descriptionLower.includes("speed") || descriptionLower.includes("reckless") || descriptionLower.includes("crash") || descriptionLower.includes("drive")) {
      suggestedCategory = "unsafe_driving";
      sentiment = "distressed";
      toxicityScore = 0.5;
    } else if (descriptionLower.includes("harass") || descriptionLower.includes("screamed")) {
      suggestedCategory = "harassment";
      sentiment = "hostile";
      toxicityScore = 0.75;
    }

    if (description.length < 15 || descriptionLower.includes("test test test") || descriptionLower.includes("lorem ipsum")) {
      isLikelyFake = true;
    }

    res.json({
      suggestedCategory,
      toxicityScore,
      sentiment,
      isLikelyFake,
      confidence: 0.75,
      reasoning: "Demonstration Mode: The Gemini API key is not currently declared in your Secrets, so a deterministic local heuristics analysis was used instead. To activate full cognitive AI classification, go to AI Studio Settings > Secrets and add GEMINI_API_KEY.",
    });
    return;
  }

  try {
    const prompt = `You are an AI Incident Classification and Threat Assessment Model built for SafeRide Africa.
Analyze the following community report submitted by a passenger regarding a ride-hailing driver.

Report description:
"${description}"

Perform the following tasks:
1. Determine the category which best fits the text description. Must be one of:
   "unsafe_driving", "harassment", "theft", "fraud", "overcharging", "vehicle_issues", "reckless_behavior", "impersonation", "suspicious_activity", "accident", "other".
2. Evaluate toxicity score (0.0 to 1.0) indicating severe aggression, abusive language or slurs.
3. Classify sentiment as: "neutral", "angry", "fearful", "distressed", or "hostile".
4. Flag as potentially fraudulent/fake (true/false) if it lacks substantial content, displays nonsensical test strings, or seems physically impossible.
5. Provide a confidence score (0.0 to 1.0) and a concise, context-aware reasoning string explaining why this categorization was made.

You must respond in strict JSON matching the schema below.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedCategory: {
              type: Type.STRING,
              description: "Must be exactly one of: unsafe_driving, harassment, theft, fraud, overcharging, vehicle_issues, reckless_behavior, impersonation, suspicious_activity, accident, other.",
            },
            toxicityScore: {
              type: Type.NUMBER,
              description: "A scale from 0.0 (perfectly respectful) to 1.0 (abusive/aggressive).",
            },
            sentiment: {
              type: Type.STRING,
              description: "Must be exactly one of: neutral, angry, fearful, distressed, hostile.",
            },
            isLikelyFake: {
              type: Type.BOOLEAN,
              description: "Set to true if text is generic gibberish, spam of characters or obvious placeholder like 'test'.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Model confidence indicator between 0.0 and 1.0.",
            },
            reasoning: {
              type: Type.STRING,
              description: "A detailed 1-2 sentence human reason outlining why the category/sentiment matches.",
            },
          },
          required: ["suggestedCategory", "toxicityScore", "sentiment", "isLikelyFake", "confidence", "reasoning"],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini classification failed, reverting to heuristics:", error);
    res.status(500).json({ error: "Gemini server process error", message: error.message });
  }
});

/**
 * Endpoint to analyze a driver's historical scores and generate customized trust recommendations.
 */
app.post("/api/driver-safety-intelligence", async (req, res) => {
  const { driver, statistics } = req.body;

  if (!driver) {
    res.status(400).json({ error: "Driver profile structure is required" });
    return;
  }

  const ai = getGeminiClient();

  if (!ai) {
    // Graceful fallback
    res.json({
      riskAssessment: `Demonstrated risk level for ${driver.fullName} is currently: ${driver.riskRating.toUpperCase()}`,
      actionSuggestions: [
        "Instruct driver SIPHO to maintain complete vehicle details and standard operating photos.",
        "Ensure background checks remain periodically active within Gauteng local police registers.",
        "Prompt the driver to confirm secondary safety devices such as digital dash-recorders.",
      ],
      safetyScoreAdvice: "Provide clean community safety credentials through endorsements. To connect full intelligence models, set GEMINI_API_KEY in AI Studio.",
    });
    return;
  }

  try {
    const prompt = `You are a Trust and Safety inspector panel for SafeRide Africa.
Analyze this driver profile:
Name: ${driver.fullName}
Operating Region: ${driver.operatingCity}, ${driver.operatingCountry}
Current Trust Score: ${driver.trustScore}/100
Risk Rating: ${driver.riskRating}
Reports logged: ${driver.reportCount}
Positive reviews: ${driver.positiveReviewsCount}
Negative reviews: ${driver.negativeReviewsCount}
Identity verified: ${driver.identityVerified}
Background verification status: ${driver.backgroundCheckVerified}

Provide a corporate trust and safety assessment as a JSON object with:
1. riskAssessment: A concise paragraph explaining the driver's risk standing.
2. actionSuggestions: An array of 3 actionable items to increase trust standing.
3. safetyScoreAdvice: Specific numerical scoring guidance for this driver.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskAssessment: { type: Type.STRING },
            actionSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            safetyScoreAdvice: { type: Type.STRING },
          },
          required: ["riskAssessment", "actionSuggestions", "safetyScoreAdvice"],
        },
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini driver rating failed:", error);
    res.status(500).json({ error: "Failed to generate risk recommendations" });
  }
});

// Serve frontend assets
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built client from 'dist' directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SafeRide Africa Server] Listening on http://localhost:${PORT}`);
  });
}

serveApp().catch((err) => {
  console.error("Failed to start application server:", err);
});
