import mongoose from "mongoose";

const StudentQuizSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.models.StudentQuiz || mongoose.model("StudentQuiz", StudentQuizSchema);
