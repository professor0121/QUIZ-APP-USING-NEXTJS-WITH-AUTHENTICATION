import { connectDB } from "../../../../lib/mongodb";
import Quiz from "../../../../models/Quiz";
import StudentQuiz from "../../../../models/StudentQuiz"; 
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        await connectDB();
        const token = req.headers.authorization?.split(" ")[1];

        console.log('Token:', token); // Debugging

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { quizId } = req.query;

        console.log('Quiz ID from Request:', quizId); // Debugging

        if (!quizId) {
            return res.status(400).json({ error: "Quiz ID is required" });
        }

        // Convert IDs to ObjectId
        const quizObjectId = new mongoose.Types.ObjectId(quizId);
        console.log('Quiz Object ID:', quizObjectId); // Debugging
        const studentObjectId = new mongoose.Types.ObjectId(decoded.id);

        let quiz;

        if (decoded.role === "teacher") {
            // Teachers can only access quizzes they created
            quiz = await Quiz.findOne({ _id: quizObjectId, teacherId: decoded.id });
            
        } else if (decoded.role === "student") {
            // Ensure student is enrolled in this quiz
            const studentQuiz = await StudentQuiz.findOne({ 
                quizId: quizObjectId, 
                studentId: studentObjectId 
            });

            console.log('Student Quiz Entry:', studentQuiz); // Debugging

            if (!studentQuiz) {
                return res.status(403).json({ error: "You are not enrolled in this quiz" });
            }

            // Fetch the quiz details
            quiz = await Quiz.findById(studentQuiz.quizId);
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
