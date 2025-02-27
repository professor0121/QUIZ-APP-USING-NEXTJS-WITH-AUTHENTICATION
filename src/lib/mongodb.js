import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
    if (cached.conn) return cached.conn; // Use existing connection if available

    if (!cached.promise) {
        console.log("📡 Connecting to MongoDB...");
        cached.promise = mongoose.connect(MONGODB_URI, {})
            .then((mongoose) => {
                console.log("✅ MongoDB Connected");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ MongoDB Connection Error:", err);
                throw err; // Throw error so we can catch it in API calls
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};
