import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface jwtPayload {
  id: number;
  name: string;
}

interface AuthRequest extends Request {
  user?: { id: number; name: string };
}

export default async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded) {
      return res.json({ message: "Not authorized, invalid" });
    }

    req.user = { id: decoded.id, name: decoded.name };

    next();
  } catch (error) {
    return res.json({ error: error });
  }
}
