import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      "MongoDB connection error: MONGODB_URI is not set in backend/.env",
    );
    return;
  }

  const isAtlas = mongoUri.startsWith("mongodb+srv://");

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 60000,
      family: 4,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error?.message || error);

    if (
      isAtlas &&
      String(error?.message || "")
        .toLowerCase()
        .includes("tls")
    ) {
      console.error(
        "Atlas TLS handshake failed. Check Atlas Network Access (allow your current IP), DB user credentials, and try appending '?retryWrites=true&w=majority&appName=HospitalChat' to MONGODB_URI.",
      );
    }
  }
};
