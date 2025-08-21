const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Podcast = sequelize.define(
    "Podcast",
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
      description: {
        type: DataTypes.TEXT,
      },
      sourceUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
          isYouTubeUrl(value) {
            if (!value.includes("youtube.com") && !value.includes("youtu.be")) {
              throw new Error("URL must be from YouTube")
            }
          },
        },
      },
      transcript: {
        type: DataTypes.TEXT("long"),
      },
      summary: {
        type: DataTypes.TEXT("long"),
      },
      businessIdeas: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      frameworks: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      founderStories: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ["user_id"],
        },
      ],
    }
  )

  return Podcast
}
