
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import the validation functions
const { registerValid, loginValid } = require("../middleware/validation");

router.post("/register",  async (req, res) => {
  //Validate Data before making a User
  console.log(req.body)
  const error = registerValid(req.body);

  if (error === undefined) {
    //Check if user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });

    if (emailExist) {
      return res.status(400).send("Email already Exist");
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // If there is no error, create a new user

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();

      const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET)
      res.header('auth-token', token).send(token);
      
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send(error.details[0].message);
  }
});

router.post("/login", async (req, res) => {
  const error = loginValid(req.body);
  console.log(req.body)
  
  if (error === undefined) {
    //Check if user is already in the database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("Email or Password Incorrect");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password )

    if (!validPass) {
      return res.status(400).send("Email or Password Incorrect");
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);

   
  } else {
    res.status(400).send(error.details[0].message);
  }
});

module.exports = router;
