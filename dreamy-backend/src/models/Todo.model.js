import mongoose from "mongoose"

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    color: { type: String, default: "#4f8cff" },
    date: { type: String, required: true }, // Add this - format: "2026-01-10"
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

const Todo = mongoose.model("Todo", todoSchema)

export default Todo;