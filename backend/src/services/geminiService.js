const { GoogleGenAI } = require("@google/genai")

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required")
    }
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  }

  async analyzeTranscript(transcript) {
    if (!transcript || typeof transcript !== "string") {
      throw new Error("Invalid transcript provided")
    }

    try {
      const prompt = `You are an expert at analyzing podcast transcripts and extracting key information.
Please analyze the following transcript and provide a structured response with these sections:

# Summary
[A concise summary of the main points]

# Business Ideas
[List of key business ideas, strategies, or insights mentioned]

# Frameworks
[List of frameworks, methodologies, or systematic approaches discussed]

# Founder Stories
[Notable founder experiences, stories, or lessons shared]

Transcript:
${transcript}`

      console.log("🤖 Sending transcript to Gemini for analysis...")
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      })

      const text = response.text
      console.log("✅ Received analysis from Gemini")

      // Parse the response into sections
      const sections = this.parseSections(text)

      return {
        summary: sections.summary || "",
        businessIdeas: sections.businessIdeas || "",
        frameworks: sections.frameworks || "",
        founderStories: sections.founderStories || "",
        aiAnalysis: {
          raw: text,
          timestamp: new Date().toISOString(),
          model: "gemini-2.5-flash",
        },
      }
    } catch (error) {
      console.error("Gemini analysis error:", error)

      if (error.message.includes("RESOURCE_EXHAUSTED")) {
        throw new Error("Gemini API quota exceeded. Please try again later.")
      }

      throw new Error(`Gemini analysis failed: ${error.message}`)
    }
  }

  parseSections(analysis) {
    const sections = {
      summary: "",
      businessIdeas: "",
      frameworks: "",
      founderStories: "",
    }

    // Split the analysis into sections based on common heading patterns
    const lines = analysis.split("\n")
    let currentSection = null

    for (const line of lines) {
      const lowerLine = line.toLowerCase()

      if (lowerLine.includes("summary") || lowerLine.includes("overview")) {
        currentSection = "summary"
        continue
      } else if (
        lowerLine.includes("business idea") ||
        lowerLine.includes("key business")
      ) {
        currentSection = "businessIdeas"
        continue
      } else if (
        lowerLine.includes("framework") ||
        lowerLine.includes("methodolog")
      ) {
        currentSection = "frameworks"
        continue
      } else if (
        lowerLine.includes("founder") ||
        lowerLine.includes("stor") ||
        lowerLine.includes("experience")
      ) {
        currentSection = "founderStories"
        continue
      }

      if (currentSection && line.trim()) {
        sections[currentSection] += line.trim() + " "
      }
    }

    // Clean up each section
    Object.keys(sections).forEach((key) => {
      sections[key] = sections[key].trim()
    })

    return sections
  }
}

module.exports = new GeminiService()
