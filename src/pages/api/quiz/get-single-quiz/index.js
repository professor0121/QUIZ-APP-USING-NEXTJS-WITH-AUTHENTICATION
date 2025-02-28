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

        const { quizId } = req.query;
        if (!quizId) {
            return res.status(400).json({ error: "Quiz ID is required" });
        }

        const quiz = await Quiz.findOne({ _id: quizId, teacherId: decoded.id });
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        return res.status(200).json({ quiz });
    } catch (error) {
        console.error("Fetch Single Quiz Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
