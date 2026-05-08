import { Router } from "express"
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/tasks.controller.js"
import { verifyToken } from "../middlewares/auth.js"

const router = Router()

router.use(verifyToken)

router.get("/", getTasks)
router.post("/", createTask)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)

export default router