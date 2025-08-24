require("dotenv").config()
const bcrypt = require("bcryptjs")
const { sequelize, User, Podcast } = require("../db")

async function seedTestData() {
  try {
    // Sync database with force:true to start fresh
    await sequelize.sync({ force: true })
    console.log("Database synced")

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    })
    console.log("Admin user created:", adminUser.toJSON())

    // Create test podcasts
    const podcasts = await Podcast.bulkCreate([
      {
        title:
          "Side Hustles: How to Make $8,000 Per Day with Multiple Income Streams",
        description:
          "Learn about unique side hustle ideas from a successful entrepreneur who makes $3 million a year from multiple businesses.",
        sourceUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        transcript:
          "[0:00] All right, this guy might be the king of\n[0:15] Coming on. Thanks, Sean.\n[73:43] [Music]",
        summary: "Key points about starting multiple income streams",
        businessIdeas: [
          "Golf Challenge Business",
          "Local Service Marketplace",
          "Online Course Creation",
        ],
        frameworks: [
          "Lean Startup",
          "Multiple Income Streams",
          "Digital Marketing",
        ],
        founderStories: ["Golf Challenge Success", "Service Business Growth"],
        userId: adminUser.id,
      },
      {
        title: "Venture Capital Insights",
        description:
          "Understanding modern venture capital and fundraising strategies",
        sourceUrl: "https://youtu.be/dQw4w9WgXcQ",
        transcript: "This is a sample transcript for the VC podcast...",
        summary: "Essential knowledge about venture capital",
        businessIdeas: ["VC Fund", "Angel Investment Platform"],
        frameworks: ["Investment Thesis", "Due Diligence Framework"],
        founderStories: ["Successful Exit Story", "Fundraising Journey"],
        userId: adminUser.id,
      },
      {
        title: "Product Market Fit Mastery",
        description: "How to achieve and measure product market fit",
        sourceUrl: "https://www.youtube.com/watch?v=M3jlkZPxcxI",
        transcript: "This is a sample transcript about product market fit...",
        summary: "Understanding and achieving product market fit",
        businessIdeas: ["Product Validation Service", "Market Research Tool"],
        frameworks: ["PMF Canvas", "Customer Development"],
        founderStories: ["Pivot Story", "Growth Story"],
        userId: adminUser.id,
      },
    ])

    console.log("Test podcasts created:", podcasts.length)
    console.log("Sample podcast:", podcasts[0].toJSON())

    console.log("\nTest data seeded successfully!")
  } catch (error) {
    console.error("Error seeding test data:", error)
  } finally {
    await sequelize.close()
  }
}

// Run the seed function
seedTestData()
