import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../../utils/protectedRoute";
import Sidebar from "../../../../components/teacher/sidebar";

const TeacherQuizzes = () => {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQuizzes = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch("/api/quiz/get-teacher-quizzes", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to fetch quizzes.");
                } else {
                    setQuizzes(data.quizzes);
                }
            } catch (err) {
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-64 bg-white">
                <h2 className="text-3xl font-bold text-gray-700">My Quizzes</h2>

                {loading ? (
                    <p className="text-gray-600 mt-4">Loading quizzes...</p>
                ) : error ? (
                    <p className="text-red-500 mt-4">{error}</p>
                ) : quizzes.length === 0 ? (
                    <p className="text-gray-600 mt-4">You haven't created any quizzes yet.</p>
                ) : (
                    <div className="mt-6 space-y-4">
                        {quizzes.map((quiz) => (
                            <div key={quiz._id} className="border p-4 rounded-lg shadow-md bg-gray-100 relative">
                                <h3 className="text-xl font-semibold text-blue-900">{quiz.title}</h3>
                                <p className="text-gray-700 mt-2">{quiz.description}</p>
                                <p className="text-sm text-gray-500 mt-2">Quiz Code: <span className="font-bold text-blue-600">{quiz.quizCode}</span></p>
                                <p className="text-xs text-gray-400 mt-1">Created on: {new Date(quiz.createdAt).toLocaleDateString()}</p>

                                {/* Edit Button Navigating with `quizId` */}
                                <button 
                                    onClick={() => router.push(`/dashboard/teacher/edit-quiz?quizId=${quiz._id}`)}
                                    className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAuth(TeacherQuizzes, "teacher");
