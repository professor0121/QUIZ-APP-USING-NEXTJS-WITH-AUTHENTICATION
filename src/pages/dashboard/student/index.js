import withAuth from "../../../utils/protectedRoute";

const StudentDashboard = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
                <h2 className="text-3xl font-bold text-blue-600">Student Dashboard</h2>
                <p className="text-gray-700 mt-4">Welcome to your student dashboard! You have access to student-related content.</p>
            </div>
        </div>
    );
};

export default withAuth(StudentDashboard, "student");
