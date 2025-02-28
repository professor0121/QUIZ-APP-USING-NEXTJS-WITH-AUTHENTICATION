import { useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        image: "",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
            setError(data.error || "Registration failed");
        } else {
            alert("Registration successful! Redirecting to login...");
            router.push("/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col">
                <h2 className="text-2xl font-bold text-center mb-4 text-green-700">Register</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <label className="text-gray-600">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input border border-black p-2 rounded-lg text-gray-600" />

                    <label className="text-gray-600">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input border border-black p-2 rounded-lg text-gray-600" />

                    <label className="text-gray-600">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input border border-black p-2 rounded-lg text-gray-600" />

                    <label className="text-gray-600">Profile Image (Optional)</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="input border border-black p-2 rounded-lg text-gray-600" />

                    <label className="text-gray-600">Role</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="input border border-black p-2 rounded-lg text-gray-600">
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>

                    <button type="submit" className="btn-primary w-64 bg-red-500 p-2 rounded-xl self-center">Register</button>
                </form>
                <p className="text-center text-gray-600 mt-4">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
            </div>
        </div>
    );
};

export default Register;
