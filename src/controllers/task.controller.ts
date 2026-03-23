import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import type { Response, Request } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: number };
}

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(10).max(50),
  priority: Joi.valid("LOW", "MEDIUM", "HIGH").required(),
  status: Joi.valid("TODO", "IN_PROGRESS", "DONE").required(),
});

export async function getTask(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "Not Authorized" });
    }

    const task = await prisma.task.findMany({
      where: {
        authorId: req.user.id,
      },
    });

    res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTask(req: AuthRequest, res: Response) {
  try {
    const { title, description, priority,status } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const validation = taskSchema.validate(req.body);

    if (validation.error) {
      return res.json(validation.error.details[0]?.message);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        authorId: req.user.id,
      },
    });

    res.status(201).json({ status: "task created successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const taskId = Number(req.params.taskId);
    const { title, description, priority, status } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const validation = taskSchema.validate(req.body);

    if (validation.error) {
      return res.json(validation.error.details[0]?.message);
    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
        authorId: req.user.id,
      },
      data: {
        title,
        description,
        priority,
        status,
      },
    });

    res.status(201).json({ status: "task created successfully", task });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const taskId = Number(req.params.taskId);
    if (!req.user) {
      return res.status(400).json({ message: "Not Authorized" });
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        authorId: req.user.id,
      },
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
