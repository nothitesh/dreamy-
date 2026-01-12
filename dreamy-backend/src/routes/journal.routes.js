import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import Journal from "../models/Journal.model.js"

const router = express.Router()

// GET journal for a day 

router.get("/:date", authMiddleware, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      user: req.user.userId,
      date: req.params.date,
    })

    res.json(journal || { content: "", title: "" })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch journal" })
  }
})

// CREATE or UPDATE journal for a day

router.post("/:date", authMiddleware, async (req, res) => {
  try {
    const { content, title } = req.body

    const journal = await Journal.findOneAndUpdate(
      { user: req.user.userId, date: req.params.date },
      { content, title },
      { upsert: true, new: true }
    )

    res.json(journal)
  } catch (err) {
    res.status(500).json({ message: "Failed to save journal" })
  }
})

export default router
