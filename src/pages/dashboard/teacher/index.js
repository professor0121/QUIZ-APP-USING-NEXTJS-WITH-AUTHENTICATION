import withAuth from "../../../utils/protectedRoute";
// import withAuth from "../../utils/protectedRoute";

const TeacherDashboard = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg text-center">
                <h2 className="text-3xl font-bold text-green-600">Teacher Dashboard</h2>
                <p className="text-gray-700 mt-4">Welcome to your teacher dashboard! You have access to teacher-related content.</p>
            </div>
        </div>
    );
};

export default withAuth(TeacherDashboard, "teacher");
