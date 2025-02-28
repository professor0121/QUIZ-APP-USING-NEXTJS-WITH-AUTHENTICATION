import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FiX } from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch("/api/auth/me", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data.user);
                } else {
                    localStorage.removeItem("token");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <>
            {/* Sidebar */}
            <div className={`h-screen w-64 bg-blue-900 text-white fixed top-0 left-0 flex flex-col shadow-lg transition-transform md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-64"} md:block`}>
                {/* Profile Section */}
                <div className="flex flex-col items-center justify-center py-6 border-b border-blue-700">
                    <img
                        src={user?.image || "/default-avatar.png"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full border-2 border-white"
                    />
                    <h3 className="mt-3 text-lg font-semibold">{user?.name || "Loading..."}</h3>
                    <p className="text-sm text-blue-300">{user?.email}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <ul className="space-y-4">
                        <li className="sidebar-link" onClick={() => router.push("/dashboard/teacher")}>
                            Home
                        </li>
                        <li className="sidebar-link" onClick={() => router.push("/dashboard/teacher/classes")}>
                            My Classes
                        </li>
                        <li className="sidebar-link" onClick={() => router.push("/dashboard/teacher/create-quiz")}>
                            Create Quiz
                        </li>
                        <li className="sidebar-link" onClick={() => router.push("/dashboard/teacher/quizzes")}>
                            My Quizzes
                        </li>

                        <li className="sidebar-link" onClick={() => router.push("/dashboard/teacher/students")}>
                            Students
                        </li>
                        <li className="sidebar-link" onClick={() => router.push("/dashboard/teacher/settings")}>
                            Settings
                        </li>
                    </ul>
                </nav>

                {/* Logout */}
                <div className="border-t border-blue-700 p-4">
                    <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">
                        Logout
                    </button>
                </div>

                {/* Close Button for Mobile */}
                <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 text-white bg-red-600 p-2 rounded-md">
                    <FiX size={24} />
                </button>
            </div>

            {/* Overlay for mobile sidebar */}
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;
