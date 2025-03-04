import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Sidebar = () => {
    const router = useRouter();
    const [student, setStudent] = useState(null);

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
                    setStudent(data.user);
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
        <div className="h-screen w-64 bg-blue-900 text-white fixed top-0 left-0 flex flex-col shadow-lg">
            {/* Profile Section */}
            <div className="flex flex-col items-center justify-center py-6 border-b border-blue-700">
                <img
                    src={student?.image || "/user.jpeg"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-white"
                />
                <h3 className="mt-3 text-lg font-semibold">{student?.name || "Loading..."}</h3>
                <p className="text-sm text-blue-300">{student?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-4">
                    <li className="sidebar-link cursor-pointer" onClick={() => router.push("/dashboard/student/home")}>
                        Home
                    </li>
                    <li className="sidebar-link cursor-pointer" onClick={() => router.push("/dashboard/student")}>
                        Profile
                    </li>
                    <li className="sidebar-link cursor-pointer" onClick={() => router.push("/dashboard/student/updateStudent")}>
                        Update Profile
                    </li>
                    <li className="sidebar-link cursor-pointer" onClick={() => router.push("/dashboard/student")}>
                        Quiz
                    </li>
                    <li className="sidebar-link cursor-pointer" onClick={() => router.push("/dashboard/student")}>
                        Dashboard
                    </li>
                </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-blue-700 p-4">
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
