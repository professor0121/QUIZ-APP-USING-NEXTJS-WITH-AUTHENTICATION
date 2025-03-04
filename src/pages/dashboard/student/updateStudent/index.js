import { useState, useEffect } from "react";
import Sidebar from "@/components/student/sidebar";
const StudentProfile = () => {
  const [user, setUser] = useState({
    name: "",
    image: "",
    bio: "",
    class: "",
    enrollmentNumber: "",
    branch: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user data on component mount
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setMessage("Unauthorized. Please login.");

        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user details.");

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Unauthorized. Please login.");

      const response = await fetch("/api/user/updateStudent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed.");

      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen">
      <Sidebar />
    <div className="mx-auto p-6  ml-64 bg-white shadow-md rounded-md w-screen">
      <h2 className="text-2xl font-semibold mb-4 w-full text-gray-700">Update Profile</h2>

      {message && <p className="text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        />

        <input
          type="text"
          name="image"
          placeholder="Profile Image URL"
          value={user.image}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        />

        <input
          type="text"
          name="bio"
          placeholder="Bio"
          value={user.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        />

        <input
          type="text"
          name="class"
          placeholder="Class"
          value={user.class}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        />

        <input
          type="text"
          name="enrollmentNumber"
          placeholder="Enrollment Number"
          value={user.enrollmentNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        />

        <select
          name="branch"
          value={user.branch}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        >
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
          <option value="AE">AE</option>
          <option value="BT">BT</option>
          <option value="CH">CH</option>
          <option value="MT">MT</option>
          <option value="PE">PE</option>
          <option value="PI">PI</option>
          <option value="TT">TT</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="New Password (Optional)"
          value={user.password}
          onChange={handleChange}
          className="w-full p-2 border rounded text-gray-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded text-gray-600"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default StudentProfile;
