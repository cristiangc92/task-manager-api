import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import tasksRoutes from "./routes/tasks.routes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/tasks", tasksRoutes)

app.get("/", (req, res) => {
    res.json({ message: "Task Manager API funcionando ✅" })
})

app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`)
})