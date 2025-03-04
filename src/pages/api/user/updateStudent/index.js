import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDB();

  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);

    // Ensure only students can update their details
    if (user.role !== "student") {
      return res.status(403).json({ error: "Access denied. Only students can update this information." });
    }

    const { name, password, image, bio, class: studentClass, enrollmentNumber, branch } = req.body;

    // Update fields if provided
    if (name) user.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (image) user.image = image;
    if (bio) user.bio = bio;
    if (studentClass) user.class = studentClass;
    if (enrollmentNumber) user.enrollmentNumber = enrollmentNumber;
    if (branch) user.branch = branch;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(401).json({ message:error.message});
  }
}
