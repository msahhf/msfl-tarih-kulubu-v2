import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "***REMOVED***";

export default function authApi(req, res, next) {
  const token =
    req.cookies?.auth_token ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Yetkisiz" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token geçersiz" });
  }
}
