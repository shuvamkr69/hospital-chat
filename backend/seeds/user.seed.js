import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import { generateAccessToken, generateRefreshToken } from "../lib/utils.js";

config();

const seedUsersData = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    fullName: "Emma Thompson",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    email: "olivia.miller@example.com",
    fullName: "Olivia Miller",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sophia.davis@example.com",
    fullName: "Sophia Davis",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    email: "ava.wilson@example.com",
    fullName: "Ava Wilson",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "isabella.brown@example.com",
    fullName: "Isabella Brown",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    email: "mia.johnson@example.com",
    fullName: "Mia Johnson",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    email: "charlotte.williams@example.com",
    fullName: "Charlotte Williams",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    email: "amelia.garcia@example.com",
    fullName: "Amelia Garcia",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    fullName: "James Anderson",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "william.clark@example.com",
    fullName: "William Clark",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    email: "benjamin.taylor@example.com",
    fullName: "Benjamin Taylor",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    email: "lucas.moore@example.com",
    fullName: "Lucas Moore",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    email: "henry.jackson@example.com",
    fullName: "Henry Jackson",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    email: "alexander.martin@example.com",
    fullName: "Alexander Martin",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    email: "daniel.rodriguez@example.com",
    fullName: "Daniel Rodriguez",
    password: "password123",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

const generateToken = (userId) => {
  // Deprecated: Use generateAccessToken + generateRefreshToken instead
  // This function kept for backward compatibility
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// New dual-token system
const generateDualTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("🔄 Starting database seeding...");

    // Clear existing users (optional - comment out if you want to preserve existing users)
    await User.deleteMany({});
    console.log("✓ Cleared existing users");

    // Hash passwords and create user objects
    const hashedUsers = await Promise.all(
      seedUsersData.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        return {
          ...userData,
          password: hashedPassword,
        };
      }),
    );

    console.log("✓ Passwords hashed");

    // Insert users into database
    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`✓ Inserted ${insertedUsers.length} users into database`);

    // Generate dual tokens (access + refresh) for each user and display them
    console.log("\n📋 Dual Tokens for seeded users:\n");
    console.log(
      "================================================================================",
    );

    const tokenList = insertedUsers.map((user) => {
      const { accessToken, refreshToken } = generateDualTokens(user._id);
      return {
        email: user.email,
        name: user.fullName,
        userId: user._id.toString(),
        accessToken,
        refreshToken,
        password: "password123", // Display plain password for reference
      };
    });

    // Display tokens in a readable format
    tokenList.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   Email:         ${item.email}`);
      console.log(`   Password:      ${item.password}`);
      console.log(`   User ID:       ${item.userId}`);
      console.log(`   Access Token:  ${item.accessToken.substring(0, 30)}...`);
      console.log(`   Refresh Token: ${item.refreshToken.substring(0, 30)}...`);
    });

    console.log(
      "\n================================================================================",
    );
    console.log("✅ Database seeding completed successfully!\n");

    // Save tokens to a file for reference
    const seedOutput = {
      timestamp: new Date().toISOString(),
      totalUsers: tokenList.length,
      users: tokenList.map((user) => ({
        email: user.email,
        name: user.name,
        userId: user.userId,
        password: user.password,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      })),
    };

    fs.writeFileSync(
      "./seeds/seeded-users-tokens.json",
      JSON.stringify(seedOutput, null, 2),
    );
    console.log("💾 Tokens saved to seeds/seeded-users-tokens.json\n");
    console.log("📌 TOKEN DETAILS:");
    console.log("   • Access Token:  15 minutes expiry (use for API requests)");
    console.log(
      "   • Refresh Token: 7 days expiry (use to regenerate access token)",
    );
    console.log(
      "   • Authorization: Bearer {accessToken} in Authorization header\n",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

// Call the function
seedDatabase();
