require("dotenv").config()
const TranscriptService = require("../services/transcriptService")
const geminiService = require("../services/geminiService")
const { Podcast, User } = require("../db")

async function testTranscriptFlow(youtubeUrl) {
  console.log("🚀 Starting transcript flow test...\n")

  try {
    // Step 0: Create or find test user
    console.log("👤 Setting up test user...")
    let testUser = await User.findOne({ where: { email: "test@example.com" } })

    if (!testUser) {
      testUser = await User.create({
        email: "test@example.com",
        password: "password123", // This is just for testing
        username: "testuser",
      })
    }
    console.log("✅ Test user ready\n")

    // Step 1: Create initial episode record
    console.log("📝 Creating episode record...")
    const episode = await Podcast.create({
      title:
        "Side Hustles: How to Make $8,000 Per Day with Multiple Income Streams",
      description:
        "Learn about unique side hustle ideas from a successful entrepreneur who makes $3 million a year from multiple businesses. From golf challenges to local services, discover actionable business ideas you can start today.",
      sourceUrl: youtubeUrl,
      status: "processing",
      userId: testUser.id,
    })
    console.log("✅ Episode record created\n")

    // Step 2: Extract YouTube transcript
    console.log("📺 Fetching YouTube transcript...")
    const transcript = await TranscriptService.getTranscript(youtubeUrl)
    console.log("✅ Transcript fetched successfully")
    console.log(
      "📄 First 200 characters of transcript:",
      transcript.substring(0, 200),
      "...\n"
    )

    // Step 3: Analyze with Gemini
    console.log("🤖 Analyzing transcript with Gemini...")
    const analysis = await geminiService.analyzeTranscript(transcript)
    console.log("✅ Gemini analysis complete\n")

    // Step 4: Update episode with results
    console.log("💾 Updating episode with analysis...")
    await episode.update({
      transcript,
      summary: analysis.summary,
      businessIdeas: analysis.businessIdeas,
      frameworks: analysis.frameworks,
      founderStories: analysis.founderStories,
      aiAnalysis: analysis.aiAnalysis,
      status: "completed",
    })
    console.log("✅ Episode updated successfully\n")

    // Display results
    console.log("🎉 Final Results:")
    console.log("==================")
    console.log("Summary:", analysis.summary)
    console.log("\nBusiness Ideas:", analysis.businessIdeas)
    console.log("\nFrameworks:", analysis.frameworks)
    console.log("\nFounder Stories:", analysis.founderStories)
  } catch (error) {
    console.error("❌ Error:", error.message)
    if (error.response?.data) {
      console.error("API Error Details:", error.response.data)
    }
  }
}

// Example usage:
const testUrl = process.argv[2] || "https://www.youtube.com/watch?v=jNQXAC9IVRw" // Default to YouTube's first video if no URL provided

console.log("🎯 Testing with URL:", testUrl)
testTranscriptFlow(testUrl)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })
