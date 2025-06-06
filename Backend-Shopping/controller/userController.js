const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const getHomepage = async (req,res) => {
    try{
        const {token} = req.cookies
        const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(tokenData.type == 'user'){
            res.render('./pages/confidence.html')
        }


    } catch(err){
        res.status(500).send({
            success: false,
            message: 'INTERNAL SERVER ERROR'
        })
    }
}

const getUsers = async (req,res) => {
    try{
        const data = await User.find({})
        res.status(200).send({
            success: true,
            message:"User data",
            data
        })
    } catch(err){
        res.status(500).send({
            success: false,
            message: 'INTERNAL SERVER ERROR'
        })
    }
}

const updateUser = async (req,res) => {

    try{
        const User_id = req.params.id

        await User.updateOne({ _id: User_id }, { $set: req.body })

        res.status(200).send({
            success: true,
            message: "User updated successfully"
        })

    } catch(err){
        res.status(404).send({
            success: false,
            message: 'INTERNAL SERVER ERROR', err
        })
    }
}

const deleteUser = async (req, res) =>{
    try{
        const User_id = req.params.id

        await User.deleteOne({ _id:User_id}, {$set: req.body})

        res.status(200).send({
            success: true,
            message: "User deleted successfully"
        })

    }  catch(err){
        res.status(404).send({
            success: false,
            message: 'INTERNAL SERVER ERROR', err
        })
    }

}

const signinUser = async (req, res) => {
    try{
        const { email, password} = req.body

        if( !email || !password){
            res.status(400).send({
                success: false,
                message: "All fields are mandatory"
            })
        }

        const object = await User.findOne({email})
        if(!object){

            return res.status(400).send({
                success: false,
                meassage: "User not found"
            }) 
        }

        if(bcrypt.compare(password, object.password)){
            const token = jwt.sign({
                userId: object._id, email:email, type:"user"
            }, process.env.JWT_SECRET_KEY, { expiresIn: '2h'})
            res.cookie("token", token, {maxAge: 2*60*60*1000})
            res.render('/')
        } 

        res.status(200).send({
            success: true,
            meassage: "Login is successfull"
        }) 
        

    } catch(err){
        res.status(404).send({
            success: false,
            message: "INTERNAL SERVER ERROR"
        })
    }
}

const signupUser = async (req, res) => {
    try{
        const { email, password, repassword } = req.body

        if( !email || !password || !repassword){
            res.status(400).send({
                success: false,
                message: "All fields are mandatory"
            })
        }

        if( password !== repassword){
            res.status(400).send({
                success: false,
                message: "Passwords are not matching"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hashSync(plaintextPassword, salt)

        const newUser = new User({
            email,
            password: hashedPassword,
            repassword: hashedPassword
        })
        await newUser.save()

        res.status(200).send({
            success: true,
            message: " User added"
        })
    } catch(err){
        res.status(500).send({
            success: false,
            message: "INTERNAL SERVER ERROR"
        })
    }

}

module.exports = {getUsers, updateUser, deleteUser, signinUser, signupUser, getHomepage}