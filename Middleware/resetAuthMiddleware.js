import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const resetAuthMiddleware = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(401).json({ message: "Token Is Missing" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Invalid Token Internal Server Error" });
  }
};
