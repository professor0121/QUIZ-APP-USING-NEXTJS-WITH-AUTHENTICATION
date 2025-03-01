import { connectDB } from "../../../../lib/mongodb";
import StudentQuiz from "../../../../models/StudentQuiz";
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
        if (decoded.role !== "student") {
            return res.status(403).json({ error: "Forbidden: Only students can view their quizzes" });
        }

        const quizzes = await StudentQuiz.find({ studentId: decoded.id });

        return res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Get Student Quizzes Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
