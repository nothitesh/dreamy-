import bcrypt from "bcryptjs"
import User from "../models/User.model.js"
import jwt from "jsonwebtoken"
 
 
export const registerUser = async (req, res) => { 
  try { 
    const { email, password } = req.body
 
    // basic validaion 
    if (!email || !password) { 
      return res.status(400).json({ message: "Email and password are required" })
    } 
    // check if user already exists 
    const existingUser = await User.findOne({ email })
    if (existingUser) { 
      return res.status(409).json({ message: "User already exists" })
    } 
    // hash password 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // create user 
    const user = await User.create({ 
      email, 
      password: hashedPassword, 
    })
    // generate token immediately after registration
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    res.status(201).json({ 
      message: "User registered successfully", 
      userId: user._id,
      token
    })
  } catch (error) { 
    console.error(error)
    res.status(500).json({ message: "Server error" })
  } 
}
 
 
export const loginUser = async (req, res) => { 
  try { 
    const { email, password } = req.body
    if (!email || !password) { 
      return res.status(400).json({ message: "Email and password are required" })
    } 
    const user = await User.findOne({ email })
    if (!user) { 
      return res.status(401).json({ message: "Invalid credentials" })
    } 
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) { 
      return res.status(401).json({ message: "Invalid credentials" })
    } 
    const token = jwt.sign( 
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } 
    ) 
    res.json({ 
      message: "Login successful", 
      token, 
    })
  } catch (error) { 
    console.error(error)
    res.status(500).json({ message: "Server error" })
  } 
}