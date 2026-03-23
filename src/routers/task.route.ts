import { Router } from "express";
import { getTask, createTask, updateTask,deleteTask } from "../controllers/task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTask);
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);


export default router;
