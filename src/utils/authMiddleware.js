import jwt from "jsonwebtoken";

export const authenticateUser = (handler) => async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        return handler(req, res); // Proceed to API handler
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
