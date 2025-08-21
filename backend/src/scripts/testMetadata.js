require("dotenv").config()
const axios = require("axios")

// Debug: Print all environment variables
console.log("Environment variables:", process.env)

async function testMetadata() {
  try {
    const videoId = "qtYFbDfHHrQ" // MFM episode about Ramp
    console.log("🔍 Fetching metadata for video ID:", videoId)

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    )

    const video = response.data.items[0]
    if (!video) {
      throw new Error("Video not found")
    }

    const metadata = {
      title: video.snippet.title,
      description: video.snippet.description,
    }

    console.log("\n✅ Metadata fetched successfully:")
    console.log("Title:", metadata.title)
    console.log("\nDescription:", metadata.description)

    return metadata
  } catch (error) {
    console.error(
      "❌ Error:",
      error.response?.data?.error?.message || error.message
    )
  }
}

testMetadata()
