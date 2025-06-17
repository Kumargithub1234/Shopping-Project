const User = require("../models/userModel");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const signinUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: email, type: "user" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 1 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Signin error:", error)
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};


const signupUser = async (req, res) => {
    const { email, password, repassword} = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            repassword: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User Registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};



module.exports = { signinUser, signupUser, }