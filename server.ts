import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // AI Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { cvData, targetLang } = req.body;
      if (!cvData) {
        return res.status(400).json({ error: "Missing CV data" });
      }

      if (!ai) {
        return res.status(500).json({
          error: "Gemini API key is not configured. Please set GEMINI_API_KEY in the Secrets panel.",
        });
      }

      const sourceLangName = targetLang === "en" ? "Spanish" : "English";
      const targetLangName = targetLang === "en" ? "English" : "Spanish";

      const prompt = `Translate the following CV / resume JSON object from ${sourceLangName} to ${targetLangName}.
Translate all user-entered descriptions, titles, tasks, summaries, etc. into a professional CV tone.
Keep the JSON keys and overall structure exactly identical to the input JSON.
Do not translate proper names of persons, technical acronyms, emails, websites, or established technology names (e.g., 'React', 'NodeJS', 'Python', etc.) unless appropriate (e.g. standard country names or job titles can be translated like 'Docente' to 'Teacher').
Return ONLY the final translated JSON. Do not include markdown code block syntax (like \`\`\`json), just the raw JSON text.

Input JSON:
${JSON.stringify(cvData, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      const text = response.text || "";
      // Clean possible markdown codeblocks if model returned them
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
      }

      try {
        const parsedTranslatedData = JSON.parse(cleanedText);
        return res.json({ translatedData: parsedTranslatedData });
      } catch (parseError) {
        console.error("Failed to parse AI translated response:", text);
        return res.status(500).json({
          error: "Failed to parse translated CV response from Gemini. The AI output was not valid JSON.",
          rawText: text,
        });
      }
    } catch (error: any) {
      console.error("Translation API error:", error);
      return res.status(500).json({
        error: error.message || "An unexpected error occurred during translation.",
      });
    }
  });

  // Serve static files / Vite HMR
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${isProd ? "production" : "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
