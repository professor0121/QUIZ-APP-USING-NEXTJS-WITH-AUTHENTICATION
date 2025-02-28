import { connectDB } from "../../../../lib/mongodb";
import Quiz from "../../../../models/Quiz";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        await connectDB();
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "teacher") {
            return res.status(403).json({ error: "Forbidden: Only teachers can access this" });
        }

        // Fetch quizzes created by the logged-in teacher
        const quizzes = await Quiz.find({ teacherId: decoded.id }).select("title description quizCode createdAt");

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Fetch Quizzes Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
