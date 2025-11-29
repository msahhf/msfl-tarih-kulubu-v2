import jwt from "jsonwebtoken";

export default function jwtAuth(req, res, next) {
  const token = req.cookies?.auth_token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "***REMOVED***"
    );
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }

  next();
}
