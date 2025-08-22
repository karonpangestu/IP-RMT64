const Joi = require("joi")

const createEpisodeSchema = Joi.object({
  title: Joi.string().required().min(3).max(255),
  sourceUrl: Joi.string()
    .required()
    .uri()
    .custom((value, helpers) => {
      const validDomains = ["youtube.com", "www.youtube.com", "youtu.be"]
      try {
        const url = new URL(value)
        if (!validDomains.includes(url.hostname)) {
          return helpers.error("string.domain", {
            domains: validDomains.join(", "),
          })
        }
        return value
      } catch (error) {
        return helpers.error("string.uri")
      }
    }, "YouTube URL validation"),
  description: Joi.string().allow("", null),
  transcript: Joi.string().allow("", null),
  summary: Joi.string().allow("", null),
  businessIdeas: Joi.string().allow("", null),
  frameworks: Joi.string().allow("", null),
  founderStories: Joi.string().allow("", null),
})

module.exports = {
  createEpisodeSchema,
}
