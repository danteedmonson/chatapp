const { Conversation, Message } = require("../models/Chat");
const User = require("../models/User");
const moment = require("moment");
const { uploadFile } = require("../s3/s3")




exports = module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on("send-message", async ({ msg, to }) => {
            console.log(msg)

            // format the user message
            if (socket.userID != to) {

                let formattedMsg = await formatMessage(
                    msg,
                    socket.userID,
                    to
                );
                console.log(formattedMsg)
                // search for convo 
                let {convoInfo, me, partner} = await getConvo(
                    socket.userID,
                    to
                );
                // store message
                convoInfo.content.push(formattedMsg);
                convoInfo.lastModified = new Date()
                await convoInfo.save();

                io.to(to).emit("chat-partner", { ...me, convo: convoInfo._id});
                io.to(socket.userID).emit("chat-partner",{ ...partner, convo: convoInfo._id});

                
                io.to(to).to(socket.userID).emit("receive-message",formattedMsg);
            }
        });
    })
}

async function getConvo(from, to) {

    try {

        let myProfile = await User.findOne(
            {
                _id: from,
            }
        );
        let user = myProfile.friends.filter((friend) => to == friend.userID)
        if (user.length != 0) {
            let curConvo = await Conversation.findOne({
                _id: user[0].convo,
            });

            let mypf = {_id:myProfile._id, username:myProfile.username, pfp:myProfile.pfp, customStatus:myProfile.customStatus }

            let friend = await User.findOne(
                {
                    _id: to,
                }
            );

            let {_id, username, pfp, customStatus } = friend;
            let frnd = {_id, username, pfp, customStatus }


            return {convoInfo: curConvo, me: mypf, partner: frnd}
        }
        else {
            let newConvo = new Conversation({
                members: [from, to],
                convoType: "dm",
                content:[],
            });
            await newConvo.save();
            myProfile.friends.push({ userID: to, convo: newConvo._id })

            myProfile.markModified("friends");
            await myProfile.save();

            
            let mypf = {_id:myProfile._id, username:myProfile.username, pfp:myProfile.pfp, customStatus:myProfile.customStatus }

            let friend = await User.findOne(
                {
                    _id: to,
                }
            );
            friend.friends.push({ userID: from, convo: newConvo._id })
            friend.markModified("friends");
            await friend.save();

            let {_id, username, pfp, customStatus } = friend;
            let frnd = {_id, username, pfp, customStatus }

            return {convoInfo: newConvo, me: mypf, partner: frnd}
        }

    } catch (error) {
        console.log(error)
        return null
    }

}

async function formatMessage(msg, from, to) {

    if(msg.type == "img" || msg.type == "vid") {
    console.log(msg.type)
      let prefix = from + Math.random().toString(36).slice(2, 10);
      msg.body.filename =  prefix + msg.body.filename.replace(/[^A-Z0-9]+/gi, "_")
      console.log(msg.body)
      await uploadFile(msg.body)
      msg.body = msg.body.filename;
    }

    return new Message({
        msg: {
            ...msg,
            read: false,
            time: new Date(),
            reactions: {
                self: "none",
                other: "none",
            },
        },
        from: from, // NOTE: string | object
        to: to,
    });
}