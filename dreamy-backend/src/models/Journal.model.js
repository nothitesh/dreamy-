import mongoose from "mongoose"

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
)

journalSchema.index({ user: 1, date: 1 }, { unique: true })

export default mongoose.model("Journal", journalSchema)