const express = require('express')
const connectdb = require('./config/db')
const User = require("./models/userModel")
const userRouter = require("./routes/userRouter")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser())
app.use('/users', userRouter)


app.listen(5000, () => {
    console.log('Server is listening on the port 5000')
})

connectdb()