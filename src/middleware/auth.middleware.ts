import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const headers = req.headers.authorization;

    if (!headers || !headers.startsWith("Bearer")) {
      return res.json({ message: "Not authorized, token missing" });
    }

    const token = headers.split(" ")[1];

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
    );

    if (!decoded) {
      return res.json({ message: "Not authorized, invalid" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.json({ error: error });
  }
}
