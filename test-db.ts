import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // 👈 load your .env.local file

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Using URI:", uri); // 👈 debug log
    await mongoose.connect(uri!);
    console.log("✅ Connected to MongoDB Atlas");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection error:", err);
    process.exit(1);
  }
})();
