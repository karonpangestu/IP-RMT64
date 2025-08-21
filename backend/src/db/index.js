const { Sequelize } = require("sequelize")
const UserModel = require("./models/User")
const PodcastModel = require("./models/Podcast")

// Initialize Sequelize with connection pooling
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
})

// Initialize models
const User = UserModel(sequelize)
const Podcast = PodcastModel(sequelize)

// Define associations
User.hasMany(Podcast, {
  foreignKey: "userId",
  as: "podcasts",
})

Podcast.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
})

module.exports = {
  sequelize,
  User,
  Podcast,
}
