import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import type { Response, Request } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const loginSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

function generateToken(data: { id: number; name: string }) {
  return jwt.sign(data, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, password, email } = req.body;

    const validation = registerSchema.validate(req.body);

    if (validation.error) {
      return res.json(validation.error.details[0]?.message);
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already existing !" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        password: hashPassword,
        email,
      },
    });

    const token = generateToken({ id: user.id, name: user.name });
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { password, email } = req.body;

    const validation = loginSchema.validate(req.body);

    if (validation.error) {
      return res.json(validation.error.details[0]?.message);
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      return res.status(400).json({ message: "Invalid Credential" });
    }

    const token = generateToken({ id: user.id, name: user.name });
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function logout(req: Request, res: Response) {
  
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
}
