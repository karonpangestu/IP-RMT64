const { fetchTranscript, InMemoryCache } = require("youtube-transcript-plus")

class TranscriptService {
  static cache = new InMemoryCache(1800000) // 30 minutes cache

  static decodeHtmlEntities(text) {
    return text
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ") // normalize whitespace
      .trim()
  }

  static async getTranscript(youtubeUrl) {
    try {
      console.log("📺 Fetching transcript for URL:", youtubeUrl)

      const transcript = await fetchTranscript(youtubeUrl, {
        lang: "en",
        cache: this.cache,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      })

      console.log("📝 Raw transcript data:", transcript)

      // Combine all transcript parts into a single text with timestamps
      const fullTranscript = transcript
        .map((part) => {
          const minutes = Math.floor(part.offset / 60)
          const seconds = Math.floor(part.offset % 60)
          const timestamp = `[${minutes}:${seconds
            .toString()
            .padStart(2, "0")}]`
          return `${timestamp} ${this.decodeHtmlEntities(part.text)}`
        })
        .join("\n")

      if (!fullTranscript) {
        throw new Error("No transcript content found")
      }

      return fullTranscript
    } catch (error) {
      console.error("Transcript error details:", error)

      // Handle specific error types
      if (error.name === "YoutubeTranscriptVideoUnavailableError") {
        throw new Error("Video is unavailable or has been removed")
      }
      if (error.name === "YoutubeTranscriptDisabledError") {
        throw new Error("Transcripts are disabled for this video")
      }
      if (error.name === "YoutubeTranscriptNotAvailableError") {
        throw new Error("No transcript is available for this video")
      }
      if (error.name === "YoutubeTranscriptNotAvailableLanguageError") {
        throw new Error("Transcript is not available in English")
      }
      if (error.name === "YoutubeTranscriptInvalidVideoIdError") {
        throw new Error("Invalid YouTube video URL")
      }

      throw new Error(`Failed to fetch transcript: ${error.message}`)
    }
  }
}

module.exports = TranscriptService
