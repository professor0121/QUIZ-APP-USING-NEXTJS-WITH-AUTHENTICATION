import { connectDB } from "../../../../lib/mongodb";
import StudentQuiz from "../../../../models/StudentQuiz";
import Quiz from "../../../../models/Quiz";
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
        if (decoded.role !== "student") {
            return res.status(403).json({ error: "Forbidden: Only students can submit quizzes" });
        }

        const { quizId, answers } = req.body;
        if (!quizId || !answers) {
            return res.status(400).json({ error: "Quiz ID and answers are required" });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        let score = 0;
        quiz.questions.forEach((q) => {
            if (answers[q._id] === q.correctAnswer) {
                score++;
            }
        });

        await StudentQuiz.findOneAndUpdate(
            { quizId, studentId: decoded.id },
            { $set: { score } },
            { new: true }
        );

        return res.status(200).json({ message: "Quiz submitted successfully", score });
    } catch (error) {
        console.error("Submit Quiz Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
