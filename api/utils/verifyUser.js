import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const test = (req, res, next) => {
  res.json({ message: "api router" });
};
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return errorHandler(401, "unauthorised");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "forbidden"));
    req.user = user;
    next();
  });
};
