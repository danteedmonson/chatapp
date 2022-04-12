
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {verify} = require("../middleware/verify")
const { uploadFile } = require("../s3/s3")


  exports = module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on("pfp-upload", async ({data, jwt}) => {


           
            let userID = verify(jwt)._id

            if(!userID) {
                return res.status(404)
            }
            console.log(userID)
        
      //Check if user is already in the database
      try {
        const user = await User.findOne({ _id: userID });
        
        let prefix = userID + Math.random().toString(36).slice(2, 10);
        data.filename =  prefix + data.filename.replace(/[^A-Z0-9]+/gi, "_")
        await uploadFile(data)

        user.pfp = data.filename;
        user.save();

        console.log(user)
        
        //return res.status(200).send("it worked");
        

      }
      catch(err){
        //return res.status(404);
        console.log(err)
      }   

        })
    })
  }
  
 // module.exports = router;