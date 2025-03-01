import { useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../utils/protectedRoute";
import Sidebar from "../../../../components/teacher/sidebar";

const CreateQuiz = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ 
        questionText: "", 
        options: ["", "", "", ""], 
        correctAnswer: "" 
    });
    const [error, setError] = useState("");
    const [quizCode, setQuizCode] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to add a new question to the quiz
    const addQuestion = () => {
        if (!newQuestion.questionText.trim() || newQuestion.options.some(opt => !opt.trim()) || !newQuestion.correctAnswer.trim()) {
            setError("Please fill in all fields for the question.");
            return;
        }

        setQuestions([...questions, newQuestion]);
        setNewQuestion({ questionText: "", options: ["", "", "", ""], correctAnswer: "" });
        setError("");
    };

    // Function to submit the quiz
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !description.trim() || questions.length === 0) {
            setError("Please provide a quiz title, description, and at least one question.");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, questions })
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(data.error || "Quiz creation failed.");
            } else {
                setQuizCode(data.quizCode);
            }
        } catch (error) {
            setLoading(false);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-64 bg-white">
                <h2 className="text-3xl font-bold text-gray-700">Create a New Quiz</h2>

                {quizCode ? (
                    <p className="mt-4 text-green-600">Quiz created successfully! Your Quiz Code: <strong>{quizCode}</strong></p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        {error && <p className="text-red-600">{error}</p>}
                        
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Quiz Title" 
                            className="input border p-4 w-full text-gray-600" 
                            required 
                        />
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Quiz Description" 
                            className="input border p-4 w-full" 
                            required 
                        />

                        <h3 className="text-lg font-semibold mt-4 text-gray-700">Questions:</h3>
                        {questions.map((q, index) => (
                            <div key={index} className="bg-gray-100 p-3 rounded-md mb-2">
                                <p className="font-bold">{q.questionText}</p>
                                <ul className="list-disc ml-5">
                                    {q.options.map((opt, i) => (
                                        <li key={i}>{opt}</li>
                                    ))}
                                </ul>
                                <p className="text-green-600">Correct Answer: {q.correctAnswer}</p>
                            </div>
                        ))}

                        {/* New Question Input Fields */}
                        <input 
                            type="text" 
                            value={newQuestion.questionText} 
                            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })} 
                            placeholder="Question" 
                            className="input border p-4 w-full" 
                            required 
                        />
                        {newQuestion.options.map((opt, i) => (
                            <input 
                                key={i} 
                                type="text" 
                                value={opt} 
                                onChange={(e) => {
                                    const updatedOptions = [...newQuestion.options];
                                    updatedOptions[i] = e.target.value;
                                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                                }} 
                                placeholder={`Option ${i + 1}`} 
                                className="input border p-2 w-full mt-2" 
                                required 
                            />
                        ))}
                        <input 
                            type="text" 
                            value={newQuestion.correctAnswer} 
                            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} 
                            placeholder="Correct Answer" 
                            className="input border p-2 w-full mt-2" 
                            required 
                        />

                        <button type="button" onClick={addQuestion} className="btn-secondary border p-2 rounded-xl bg-green-700 text-white w-full mt-2">Add Question</button>
                        <button type="submit" className="btn-primary border p-2 w-full bg-blue-500 text-white rounded-xl mt-2" disabled={loading}>
                            {loading ? "Creating..." : "Create Quiz"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default withAuth(CreateQuiz, "teacher");
