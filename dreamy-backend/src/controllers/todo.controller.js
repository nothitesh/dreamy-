import Todo from "../models/Todo.model.js"

// Create a todo
export const createTodo = async (req, res) => {
  try {
    const { title, start, end, color, date } = req.body
    if (!title) return res.status(400).json({ message: "Title is required" })
    if (start === undefined) return res.status(400).json({ message: "Start time is required" })
    if (end === undefined) return res.status(400).json({ message: "End time is required" })
    if (!date) return res.status(400).json({ message: "Date is required" })

    const todo = await Todo.create({
      title,
      start,
      end,
      color: color || "#4f8cff",
      date,
      user: req.user._id,
    })

    res.status(201).json(todo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get todos for a specific date
export const getTodos = async (req, res) => {
  try {
    const { date } = req.query
    
    if (!date) {
      return res.status(400).json({ message: "Date is required" })
    }

    const todos = await Todo.find({ user: req.user._id, date })
    res.json(todos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update a todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, start, end, color, completed, date } = req.body
    const todo = await Todo.findOne({ _id: id, user: req.user._id })
    if (!todo) return res.status(404).json({ message: "Todo not found" })
    if (title !== undefined) todo.title = title
    if (start !== undefined) todo.start = start
    if (end !== undefined) todo.end = end
    if (color !== undefined) todo.color = color
    if (date !== undefined) todo.date = date
    if (completed !== undefined) todo.completed = completed
    await todo.save()
    res.json(todo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id })
    if (!todo) return res.status(404).json({ message: "Todo not found" })

    res.json({ message: "Todo deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}