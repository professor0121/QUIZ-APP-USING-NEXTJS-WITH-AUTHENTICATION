import { useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        if (user.role === "teacher") {
            router.push("/dashboard/teacher");
        } else {
            router.push("/dashboard/student");
        }
    }, []);

    return <div>Redirecting...</div>;
};

export default Dashboard;
