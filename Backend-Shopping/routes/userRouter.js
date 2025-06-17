const express = require("express")
const { signinUser, signupUser} = require("../controller/userController")

const userRouter = express.Router()

userRouter.post('/signin', signinUser)

userRouter.post('/signup', signupUser)

module.exports = userRouter