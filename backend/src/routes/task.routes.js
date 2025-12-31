import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controller/task.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
