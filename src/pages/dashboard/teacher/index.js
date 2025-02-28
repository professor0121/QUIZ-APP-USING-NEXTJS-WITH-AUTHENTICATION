import { useState } from "react";
import withAuth from "../../../utils/protectedRoute";
import Sidebar from "../../../components/teacher/sidebar";
import { FiMenu } from "react-icons/fi";

const TeacherDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex">
            {/* Sidebar (Hidden on mobile, open by default on desktop) */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className={`flex-1 p-6 transition-all ${sidebarOpen ? "ml-64" : "ml-0 md:ml-64"}`}>
                {/* Hamburger Menu for Mobile */}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 bg-blue-900 text-white rounded-md mb-4">
                    <FiMenu size={24} />
                </button>

                <h2 className="text-3xl font-bold text-gray-700">Welcome, Teacher!</h2>
                <p className="text-gray-600 mt-4">
                    Manage your classes, students, and settings from here.
                </p>
            </div>
        </div>
    );
};

export default withAuth(TeacherDashboard, "teacher");
