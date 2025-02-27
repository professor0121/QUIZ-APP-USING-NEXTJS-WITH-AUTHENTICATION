import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent, requiredRole) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT
            if (requiredRole && user.role !== requiredRole) {
                router.push("/dashboard/" + user.role); // Redirect to correct dashboard
            }
        }, []);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
