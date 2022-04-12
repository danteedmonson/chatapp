
const router = require("express").Router();
const User = require("../models/User");
const {verify} = require("../middleware/verify")


router.get("/getuser", async (req, res) => {
    console.log(req.body)
    
    const jwt = req.header('auth-token');
    let userID = verify(jwt)?._id

    if(!userID){
        return res.status(404);

    }

  
      //Check if user is already in the database
      try {
        const user = await User.findOne({ _id: userID });
        console.log(user)
        let {username, pfp, customStatus} = user;
        return res.status(200).json({username, pfp, customStatus});

      }
      catch(err){
        return res.status(404);
      }      
  });
  
  module.exports = router;