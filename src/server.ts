import "dotenv/config";
import express, { type Request, type Response } from "express";
import userRouter from "./routers/user.route.js";
import authMiddleware from "./middleware/auth.middleware.js";

const app = express();
app.use(express.json());

app.use("/auth", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} ...`);
});
