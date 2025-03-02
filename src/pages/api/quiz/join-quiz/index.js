// import { connectDB } from "../../../../lib/mongodb";
// import Quiz from "../../../../models/Quiz";
// import StudentQuiz from "../../../../models/StudentQuiz";
// import jwt from "jsonwebtoken";

// export default async function handler(req, res) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ error: "Method Not Allowed" });
//     }

//     try {
//         await connectDB();
//         const token = req.headers.authorization?.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({ error: "Unauthorized: No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if (decoded.role !== "student") {
//             return res.status(403).json({ error: "Forbidden: Only students can join quizzes" });
//         }

//         const { quizCode } = req.body;
//         if (!quizCode) {
//             return res.status(400).json({ error: "Quiz code is required" });
//         }

//         // Find quiz by code
//         const quiz = await Quiz.findOne({ quizCode });
//         if (!quiz) {
//             return res.status(404).json({ error: "Quiz not found" });
//         }

//         // Check if student already joined the quiz
//         const existingEntry = await StudentQuiz.findOne({ quizId: quiz._id, studentId: decoded.id });
//         if (existingEntry) {
//             return res.status(400).json({ error: "You have already joined this quiz" });
//         }

//         // Save student quiz entry
//         const studentQuiz = new StudentQuiz({
//             quizId: quiz._id,
//             studentId: decoded.id,
//             title: quiz.title,
//             description: quiz.description,
//         });
//         await studentQuiz.save();

//         return res.status(200).json({ message: "Quiz joined successfully", quiz });
//     } catch (error) {
//         console.error("Join Quiz Error:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }
import { connectDB } from "../../../../lib/mongodb";
import Quiz from "../../../../models/Quiz";
import StudentQuiz from "../../../../models/StudentQuiz";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
            return res.status(403).json({ error: "Forbidden: Only students can join quizzes" });
        }

        const { quizCode } = req.body;
        if (!quizCode) {
            return res.status(400).json({ error: "Quiz code is required" });
        }

        // Find quiz by code
        const quiz = await Quiz.findOne({ quizCode });
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        // Convert `quizId` and `studentId` to ObjectId
        const quizObjectId = new mongoose.Types.ObjectId(quiz._id);
        const studentObjectId = new mongoose.Types.ObjectId(decoded.id);

        // Check if student already joined
        const existingEntry = await StudentQuiz.findOne({ quizId: quizObjectId, studentId: studentObjectId });
        if (existingEntry) {
            return res.status(400).json({ error: "You have already joined this quiz" });
        }

        // Save student quiz entry
        const studentQuiz = new StudentQuiz({
            quizId: quizObjectId,
            studentId: studentObjectId,
            title: quiz.title,
            description: quiz.description,
        });
        await studentQuiz.save();

        return res.status(200).json({ message: "Quiz joined successfully", quiz });
    } catch (error) {
        console.error("Join Quiz Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
