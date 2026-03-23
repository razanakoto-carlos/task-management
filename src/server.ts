import "dotenv/config";
import express, { type Request, type Response } from "express";
import authRouter from "./routers/user.route.js";
import taskRouter from "./routers/task.route.js";
import authMiddleware from "./middleware/auth.middleware.js";
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/auth", authRouter);
app.use("/task", taskRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ...`);
});
