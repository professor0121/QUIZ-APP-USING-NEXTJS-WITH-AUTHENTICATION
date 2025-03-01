import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../utils/protectedRoute";
import Sidebar from "../../../../components/teacher/sidebar";

const EditQuiz = () => {
    const router = useRouter();
    const { quizId } = router.query;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!quizId) return;

        const fetchQuiz = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(`/api/quiz/get-single-quiz?quizId=${quizId}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to load quiz.");
                } else {
                    setTitle(data.quiz.title);
                    setDescription(data.quiz.description);
                    setQuestions(data.quiz.questions);
                }
            } catch (err) {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleSave = async () => {
        setError("");
        if (!title.trim() || !description.trim() || questions.length === 0) {
            setError("Title, description, and at least one question are required.");
            return;
        }

        setSaving(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/quiz/edit", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quizId, title, description, questions })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to update quiz.");
            } else {
                router.push("/dashboard/teacher/quizzes");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[optIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]);
    };

    const removeQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-64 bg-white">
                <h2 className="text-3xl font-bold text-gray-700">Edit Quiz</h2>

                {loading ? (
                    <p className="text-gray-600 mt-4">Loading quiz...</p>
                ) : error ? (
                    <p className="text-red-500 mt-4">{error}</p>
                ) : (
                    <>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="border p-2 w-full mt-4 text-gray-700" 
                            placeholder="Quiz Title"
                        />
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="border p-2 w-full mt-2 text-gray-700" 
                            placeholder="Quiz Description"
                        />

                        <h3 className="text-lg font-semibold mt-4 text-gray-700">Questions:</h3>
                        {questions.map((q, index) => (
                            <div key={index} className="border p-4 rounded-lg bg-gray-100 mt-4">
                                <input 
                                    type="text" 
                                    value={q.questionText} 
                                    onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)} 
                                    className="border p-2 w-full text-gray-700" 
                                    placeholder="Question Text"
                                />
                                <p className="font-bold text-green-600 mt-4">Option</p>
                                {q.options.map((opt, i) => (
                                    <input 
                                        key={i} 
                                        type="text" 
                                        value={opt} 
                                        onChange={(e) => handleOptionChange(index, i, e.target.value)} 
                                        className="border p-2 w-full mt-1 text-gray-700" 
                                        placeholder={`Option ${i + 1}`}
                                    />
                                ))}
                                <p className="text-green-600">Correct Answer:</p>
                                <input 
                                    type="text" 
                                    value={q.correctAnswer} 
                                    onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)} 
                                    className="border p-2 w-full mt-2 text-gray-700" 
                                    placeholder="Correct Answer"
                                />
                                <button onClick={() => removeQuestion(index)} className="bg-red-500 text-white px-2 py-1 rounded-md mt-2">Remove</button>
                            </div>
                        ))}
                        <button onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 mr-4">Add Question</button>
                        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">{saving ? "Saving..." : "Save Changes"}</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default withAuth(EditQuiz, "teacher");
