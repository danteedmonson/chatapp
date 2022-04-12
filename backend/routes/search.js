
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/search", async (req, res) => {
    console.log(req.body)
    
  
  
      //Check if user is already in the database
      try {
        const users = await User.find({username: {$regex: req.body.term, $options: "$i"}});
        let userArray = users.map(element => {
            let {_id, username, pfp, customStatus } = element;
            return {_id, username, pfp, customStatus };
            
        });
        console.log(userArray)
        return res.status(200).send(userArray);
        

      }
      catch(err){
        return res.status(404);
      }      
  });
  
  module.exports = router;