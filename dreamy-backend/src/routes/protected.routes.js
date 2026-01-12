import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"


const router = express.Router()

// test route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user.email })
})

export default router
