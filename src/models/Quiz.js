import mongoose from "mongoose";
import { nanoid } from "nanoid";

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Quiz title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    quizCode: {
        type: String,
        unique: true,
        default: () => nanoid(8) // Generates a unique 8-character quiz code
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    questions: [
        {
            questionText: { type: String, required: true },
            options: [{ type: String, required: true }],
            correctAnswer: { type: String, required: true }
        }
    ]
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
