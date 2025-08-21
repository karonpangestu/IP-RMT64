const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    static associate(models) {
      // Define associations here
    }

    // Add getters for JSON fields
    getBusinessIdeas() {
      try {
        return JSON.parse(this.businessIdeas || "[]")
      } catch (e) {
        return []
      }
    }

    getFrameworks() {
      try {
        return JSON.parse(this.frameworks || "[]")
      } catch (e) {
        return []
      }
    }

    getFounderStories() {
      try {
        return JSON.parse(this.founderStories || "[]")
      } catch (e) {
        return []
      }
    }

    // Add setters for JSON fields
    setBusinessIdeas(value) {
      this.businessIdeas = JSON.stringify(value)
    }

    setFrameworks(value) {
      this.frameworks = JSON.stringify(value)
    }

    setFounderStories(value) {
      this.founderStories = JSON.stringify(value)
    }
  }

  Episode.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sourceUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transcript: {
        type: DataTypes.TEXT,
      },
      summary: {
        type: DataTypes.TEXT,
      },
      businessIdeas: {
        type: DataTypes.TEXT,
      },
      frameworks: {
        type: DataTypes.TEXT,
      },
      founderStories: {
        type: DataTypes.TEXT,
      },
      aiAnalysis: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      status: {
        type: DataTypes.ENUM("pending", "processing", "completed", "failed"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Episode",
    }
  )

  return Episode
}
