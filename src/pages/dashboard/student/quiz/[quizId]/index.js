import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../../utils/protectedRoute";
import Sidebar from "../../../../../components/student/sidebar";

const AttemptQuiz = () => {
    const router = useRouter();
    const { quizId } = router.query;

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
                if (res.ok) {
                    setQuiz(data.quiz);
                    setAnswers(data.quiz.questions.reduce((acc, q) => {
                        acc[q._id] = "";
                        return acc;
                    }, {}));
                } else {
                    setError(data.error || "Failed to load quiz.");
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/quiz/submit-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quizId, answers })
            });

            const data = await res.json();
            if (res.ok) {
                alert("Quiz submitted successfully!");
                router.push("/dashboard/student");
            } else {
                setError(data.error || "Failed to submit quiz.");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-64 bg-white">
                <h2 className="text-3xl font-bold text-gray-700">Attempt Quiz</h2>

                {loading ? (
                    <p className="text-gray-600 mt-4">Loading quiz...</p>
                ) : error ? (
                    <p className="text-red-500 mt-4">{error}</p>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold mt-4">{quiz.title}</h3>
                        <p className="text-gray-600">{quiz.description}</p>

                        <div className="mt-6 space-y-6">
                            {quiz.questions.map((q, index) => (
                                <div key={q._id} className="border p-4 rounded-lg bg-gray-100">
                                    <h4 className="text-lg font-semibold">{index + 1}. {q.questionText}</h4>
                                    {q.options.map((opt, i) => (
                                        <label key={i} className="block mt-2">
                                            <input
                                                type="radio"
                                                name={q._id}
                                                value={opt}
                                                checked={answers[q._id] === opt}
                                                onChange={() => handleAnswerChange(q._id, opt)}
                                            />
                                            <span className="ml-2">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-6 py-2 mt-6 rounded-md"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Quiz"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default withAuth(AttemptQuiz, "student");
