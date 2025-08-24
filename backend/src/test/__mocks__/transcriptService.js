// Mock for transcriptService
class TranscriptService {
  static async fetchTranscript(url) {
    return [
      {
        text: "This is a mock transcript for testing",
        duration: 1000,
        offset: 0,
      },
    ]
  }

  static async processTranscript(transcript) {
    return {
      summary: "This is a mock summary for testing",
      keyPoints: ["Key point 1", "Key point 2"],
      transcript: transcript,
    }
  }
}

module.exports = TranscriptService
