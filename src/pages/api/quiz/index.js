import { connectDB } from "../../../lib/mongodb";
import Quiz from "../../../models/Quiz";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") {
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
            return res.status(403).json({ error: "Forbidden: Only teachers can create quizzes" });
        }

        const { title, description, questions } = req.body;
        if (!title || !description || !questions || questions.length === 0) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newQuiz = new Quiz({ title, description, teacherId: decoded.id, questions });
        await newQuiz.save();

        return res.status(201).json({ message: "Quiz created successfully", quizCode: newQuiz.quizCode });
    } catch (error) {
        console.error("Quiz Creation Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
