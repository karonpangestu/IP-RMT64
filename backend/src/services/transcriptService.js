const axios = require('axios');
const { YoutubeTranscript } = require('youtube-transcript-api');
const cheerio = require('cheerio');
const OpenAI = require('openai');

class TranscriptService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Extract video ID from YouTube URL
  extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Extract episode ID from Spotify URL
  extractSpotifyId(url) {
    const regex = /spotify\.com\/episode\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Fetch transcript from YouTube
  async fetchYouTubeTranscript(url) {
    try {
      const videoId = this.extractYouTubeId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      
      // Combine all transcript parts into one text
      const fullTranscript = transcript
        .map(part => part.text)
        .join(' ');

      return {
        transcript: fullTranscript,
        sourceType: 'youtube',
        videoId: videoId
      };
    } catch (error) {
      console.error('Error fetching YouTube transcript:', error);
      throw new Error(`Failed to fetch YouTube transcript: ${error.message}`);
    }
  }

  // Fetch transcript from Spotify (placeholder - would need Spotify API)
  async fetchSpotifyTranscript(url) {
    try {
      const episodeId = this.extractSpotifyId(url);
      if (!episodeId) {
        throw new Error('Invalid Spotify URL');
      }

      // Note: Spotify doesn't provide transcripts via public API
      // This would require Spotify API integration or manual transcript upload
      throw new Error('Spotify transcripts require API integration or manual upload');
    } catch (error) {
      console.error('Error fetching Spotify transcript:', error);
      throw new Error(`Failed to fetch Spotify transcript: ${error.message}`);
    }
  }

  // Fetch transcript based on source type
  async fetchTranscript(url, sourceType = 'youtube') {
    switch (sourceType.toLowerCase()) {
      case 'youtube':
        return await this.fetchYouTubeTranscript(url);
      case 'spotify':
        return await this.fetchSpotifyTranscript(url);
      default:
        throw new Error(`Unsupported source type: ${sourceType}`);
    }
  }

  // Process transcript with OpenAI to extract structured data
  async processTranscriptWithAI(transcript) {
    try {
      const prompt = `
        Analyze the following podcast transcript and extract structured information in JSON format:

        Transcript:
        ${transcript}

        Please provide a JSON response with the following structure:
        {
          "transcriptSummary": "A concise 2-3 sentence summary of the main topics discussed",
          "businessIdeas": [
            {
              "title": "Idea title",
              "description": "Brief description of the business idea",
              "potential": "High/Medium/Low",
              "category": "e.g., SaaS, E-commerce, Service Business"
            }
          ],
          "frameworks": [
            {
              "name": "Framework name",
              "description": "Brief description of the framework",
              "application": "How to apply this framework"
            }
          ],
          "timelessInsights": [
            {
              "insight": "The timeless business insight",
              "explanation": "Why this insight is valuable",
              "examples": "Real-world examples mentioned"
            }
          ],
          "founderStories": [
            {
              "founder": "Founder name or company",
              "story": "Key part of their founder story",
              "lesson": "Business lesson learned",
              "outcome": "Result or current status"
            }
          ]
        }

        Focus on actionable business insights, practical frameworks, and inspiring founder stories. Make the content valuable for entrepreneurs and business professionals.
      `;

      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst expert at extracting valuable insights from podcast transcripts. Provide structured, actionable information in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
        temperature: 0.3,
      });

      const response = completion.choices[0].message.content;
      
      // Try to parse the JSON response
      try {
        const parsedResponse = JSON.parse(response);
        return parsedResponse;
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        // Fallback: return basic structure if JSON parsing fails
        return {
          transcriptSummary: "AI processing completed but response format was invalid",
          businessIdeas: [],
          frameworks: [],
          timelessInsights: [],
          founderStories: []
        };
      }
    } catch (error) {
      console.error('Error processing transcript with AI:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  // Get video metadata from YouTube
  async getYouTubeMetadata(url) {
    try {
      const videoId = this.extractYouTubeId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Fetch video page to extract metadata
      const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`);
      const $ = cheerio.load(response.data);

      // Extract title
      const title = $('meta[property="og:title"]').attr('content') || 
                   $('title').text().replace(' - YouTube', '');

      // Extract description
      const description = $('meta[property="og:description"]').attr('content') || 
                        $('meta[name="description"]').attr('content');

      // Extract thumbnail
      const thumbnail = $('meta[property="og:image"]').attr('content');

      // Extract duration (this is more complex and may require additional API calls)
      const duration = null; // Would need YouTube Data API for accurate duration

      return {
        title: title || 'Unknown Title',
        description: description || '',
        thumbnail: thumbnail || '',
        duration: duration,
        publishedAt: new Date() // Would need YouTube Data API for actual publish date
      };
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
      return {
        title: 'Unknown Title',
        description: '',
        thumbnail: '',
        duration: null,
        publishedAt: new Date()
      };
    }
  }

  // Complete transcript processing pipeline
  async processEpisode(url, sourceType = 'youtube') {
    try {
      // Step 1: Fetch transcript
      const transcriptData = await this.fetchTranscript(url, sourceType);
      
      // Step 2: Get metadata
      let metadata = {};
      if (sourceType === 'youtube') {
        metadata = await this.getYouTubeMetadata(url);
      }

      // Step 3: Process with AI
      const aiProcessedData = await this.processTranscriptWithAI(transcriptData.transcript);

      return {
        transcript: transcriptData.transcript,
        transcriptSummary: aiProcessedData.transcriptSummary,
        businessIdeas: aiProcessedData.businessIdeas || [],
        frameworks: aiProcessedData.frameworks || [],
        timelessInsights: aiProcessedData.timelessInsights || [],
        founderStories: aiProcessedData.founderStories || [],
        metadata: metadata
      };
    } catch (error) {
      console.error('Error in complete transcript processing:', error);
      throw error;
    }
  }
}

module.exports = new TranscriptService();
