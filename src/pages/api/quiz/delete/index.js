import { connectDB } from "../../../../lib/mongodb";
import Quiz from "../../../../models/Quiz";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
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
            return res.status(403).json({ error: "Forbidden: Only teachers can delete quizzes" });
        }

        const { quizId } = req.query;
        if (!quizId) {
            return res.status(400).json({ error: "Quiz ID is required" });
        }

        const quiz = await Quiz.findOneAndDelete({ _id: quizId, teacherId: decoded.id });

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found or not authorized to delete" });
        }

        return res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Delete Quiz Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
