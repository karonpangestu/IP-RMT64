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
${transcript}
`

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
      businessIdeas: [],
      frameworks: [],
      founderStories: [],
    }

    const lines = analysis.split("\n")
    let currentSection = null
    let currentItem = {
      title: "",
      description: "",
    }

    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim()

      // Handle section headers
      if (lowerLine.includes("summary") || lowerLine.includes("overview")) {
        currentSection = "summary"
        continue
      } else if (lowerLine.includes("business idea")) {
        currentSection = "businessIdeas"
        continue
      } else if (lowerLine.includes("framework")) {
        currentSection = "frameworks"
        continue
      } else if (lowerLine.includes("founder")) {
        currentSection = "founderStories"
        continue
      }

      // Skip empty lines
      if (!line.trim()) continue

      if (currentSection === "summary") {
        sections.summary += line.trim() + " "
      } else if (
        ["businessIdeas", "frameworks", "founderStories"].includes(
          currentSection
        )
      ) {
        // Check if line starts with a bullet point or asterisk
        if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
          // If we have a previous item with content, save it
          if (currentItem.title || currentItem.description) {
            sections[currentSection].push(
              `${currentItem.title}${
                currentItem.title && currentItem.description ? ": " : ""
              }${currentItem.description}`.trim()
            )
          }
          // Start new item
          const content = line.replace(/^[-*]\s*/, "").trim()
          if (content.includes(":")) {
            const [title, ...desc] = content.split(":")
            currentItem = {
              title: title.trim(),
              description: desc.join(":").trim(),
            }
          } else {
            currentItem = {
              title: "",
              description: content,
            }
          }
        } else if (currentItem) {
          // Add to current item's description
          currentItem.description += " " + line.trim()
        }
      }
    }

    // Don't forget to push the last item if exists
    if (currentSection && (currentItem.title || currentItem.description)) {
      sections[currentSection].push(
        `${currentItem.title}${
          currentItem.title && currentItem.description ? ": " : ""
        }${currentItem.description}`.trim()
      )
    }

    // Clean up
    sections.summary = sections.summary.trim()

    return sections
  }
}

module.exports = new GeminiService()
