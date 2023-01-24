import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const token = authHeader?.split(" ")[1]; //Authorization: "Bearer (token)"

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) res.status(401).json({ message: "Unauthorized " });
      req._id = decoded.id;
      next();
    }); 
  }
};

export default authMiddleware;
