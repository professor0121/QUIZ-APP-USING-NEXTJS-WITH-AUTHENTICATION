import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../../utils/protectedRoute";
import Sidebar from "../../../components/student/sidebar";

const StudentDashboard = () => {
    const router = useRouter();
    const [student, setStudent] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [quizCode, setQuizCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                if (res.ok) {
                    setStudent(data.user);
                    fetchJoinedQuizzes();
                } else {
                    setError(data.error || "Failed to load profile.");
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        const fetchJoinedQuizzes = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch("/api/quiz/get-student-quizzes", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = await res.json();
                if (res.ok) {
                    setQuizzes(data.quizzes);
                } else {
                    setError(data.error || "Failed to fetch quizzes.");
                }
            } catch (err) {
                setError("Something went wrong.");
            }
        };

        fetchProfile();
    }, []);

    const handleJoinQuiz = async () => {
        setError("");
        if (!quizCode.trim()) {
            setError("Enter a valid quiz code.");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("/api/quiz/join-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ quizCode })
            });

            const data = await res.json();
            if (res.ok) {
                setQuizzes([...quizzes, data.quiz]); // Add new quiz to list
                setQuizCode(""); // Reset input field
            } else {
                setError(data.error || "Failed to join quiz.");
            }
        } catch (err) {
            setError("Something went wrong.");
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 ml-64 bg-white">
                <h2 className="text-3xl font-bold text-gray-700">Student Dashboard</h2>

                {loading ? (
                    <p className="text-gray-600 mt-4">Loading profile...</p>
                ) : error ? (
                    <p className="text-red-500 mt-4">{error}</p>
                ) : (
                    <div className="bg-gray-100 p-4 rounded-lg mt-4">
                        <h3 className="text-xl font-semibold text-blue-900">{student?.name}</h3>
                        <p className="text-gray-700">{student?.email}</p>
                    </div>
                )}

                {/* Join Quiz Section */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-700">Join a Quiz</h3>
                    <div className="flex mt-2">
                        <input
                            type="text"
                            value={quizCode}
                            onChange={(e) => setQuizCode(e.target.value)}
                            placeholder="Enter Quiz Code"
                            className="border p-2 w-full"
                        />
                        <button onClick={handleJoinQuiz} className="bg-green-500 text-white px-4 py-2 ml-2 rounded-md">Join</button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                {/* List of Joined Quizzes */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-700">My Quizzes</h3>
                    {quizzes.length === 0 ? (
                        <p className="text-gray-600 mt-2">No quizzes joined yet.</p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {quizzes.map((quiz) => (
                                <div key={quiz._id} className="border p-4 rounded-lg shadow-md bg-gray-100">
                                    <h3 className="text-lg font-semibold text-blue-900">{quiz.title}</h3>
                                    <p className="text-gray-700 mt-2">{quiz.description}</p>
                                    <button 
                                        onClick={() => router.push(`/dashboard/student/quiz/${quiz._id}`)}
                                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withAuth(StudentDashboard, "student");
