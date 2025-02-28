import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../utils/protectedRoute";
import Sidebar from "../../../../components/teacher/sidebar";

const EditQuiz = () => {
    const router = useRouter();
    const { quizId } = router.query;  // Accessing quizId from query params

    console.log("Quiz ID from URL:", quizId); // Debugging

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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
                            className="border p-2 w-full mt-4" 
                            placeholder="Quiz Title"
                        />
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="border p-2 w-full mt-2" 
                            placeholder="Quiz Description"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default withAuth(EditQuiz, "teacher");
