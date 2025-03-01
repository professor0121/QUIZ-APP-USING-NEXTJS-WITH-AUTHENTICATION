import { connectDB } from "../../../../lib/mongodb";
import Quiz from "../../../../models/Quiz";
import StudentQuiz from "../../../../models/StudentQuiz"; 
import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Import mongoose to convert quizId to ObjectId

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        await connectDB();
        const token = req.headers.authorization?.split(" ")[1];
 console.log('token',token)
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { quizId } = req.query;
        console.log('quizId',quizId)

        if (!quizId) {
            return res.status(400).json({ error: "Quiz ID is required" });
        }

        let quiz;
        const quizObjectId = new mongoose.Types.ObjectId(quizId); // Convert to ObjectId for MongoDB search

        if (decoded.role === "teacher") {
            // Teachers can only access quizzes they created
            quiz = await Quiz.findOne({ _id: quizObjectId, teacherId: decoded.id });
        } else if (decoded.role === "student") {
            // Check if the student has joined this quiz
            const studentQuiz = await StudentQuiz.findOne({ quizId: quizObjectId, studentId: decoded.id });
            if (!studentQuiz) {
                return res.status(403).json({ error: "You are not enrolled in this quiz" });
            }

            // Fetch the quiz details
            quiz = await Quiz.findById(quizObjectId);
        }

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        return res.status(200).json({ quiz });
    } catch (error) {
        console.error("Fetch Single Quiz Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
