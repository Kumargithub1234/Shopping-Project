const express = require("express")
const { getUsers, updateUser, deleteUser, signinUser, signupUser, getHomepage } = require("../controller/userController")

const userRouter = express.Router()

userRouter.get('/', getHomepage)

userRouter.get('/get-users', getUsers)

userRouter.put('/update-user/:id', updateUser)

userRouter.delete('/delete-user/:id', deleteUser)

userRouter.post('/signin', signinUser)

userRouter.post('/signup', signupUser)

module.exports = userRouter