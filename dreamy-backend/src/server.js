import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import protectedRoutes from "./routes/protected.routes.js"
import todoRoutes from "./routes/todo.routes.js"
import journalRoutes from "./routes/journal.routes.js"

dotenv.config()

const app = express()

// middleware
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use("/auth", authRoutes)
app.use("/api", protectedRoutes)
app.use("/todos", todoRoutes)
app.use("/journal", journalRoutes)

// test route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "we guccii" })
})

// connect DB
connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})