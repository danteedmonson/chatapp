const { Conversation, Message } = require("../models/Chat");
const User = require("../models/User");
const moment = require("moment");
const { uploadFile } = require("../s3/s3")




exports = module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on("send-message", async ({ msg, to, type }) => {
            console.log(msg)

            // format the user message
            if (socket.userID !== to) {       

                let formattedMsg = await formatMessage(
                    msg,
                    socket.userID,
                    to,
                    type
                );
                console.log(formattedMsg)
                //search for convo 
                let convoObj;
                if (type == "dm") {
                    convoObj = await getDirectConvo(
                        socket.userID,
                        to
                    );
                }
                else {
                    convoObj = await getGroupConvo(
                        socket.userID,
                        to
                    );
                    console.log("THIS IS A GROUP")
                }
                let { convoInfo, me, partner, sendTo } = convoObj;
                // store message
                convoInfo.content.push(formattedMsg);
                console.log(convoInfo)
                convoInfo.lastModified = new Date()
                await convoInfo.save();

                if(type == "dm") {
                    io.to(to).emit("chat-partner", { ...me, convo: convoInfo._id });
                    io.to(socket.userID).emit("chat-partner", { ...partner, convo: convoInfo._id });
                }

                console.log(sendTo)
                io.to(sendTo).to(socket.userID).emit("receive-message", formattedMsg);
            }
            else {
                console.log("ayyyooo")
            }
        });
    })
}

async function getDirectConvo(from, to) {

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

            let mypf = { _id: myProfile._id, username: myProfile.username, pfp: myProfile.pfp, customStatus: myProfile.customStatus }

            let friend = await User.findOne(
                {
                    _id: to,
                }
            );

            let { _id, username, pfp, customStatus } = friend;
            let frnd = { _id, username, pfp, customStatus }


            return { convoInfo: curConvo, me: mypf, partner: frnd }
        }
        else {
            let newConvo = new Conversation({
                members: [from, to],
                convoType: "dm",
                content: [],
            });
            await newConvo.save();
            myProfile.friends.push({ userID: to, convo: newConvo._id })

            myProfile.markModified("friends");
            await myProfile.save();


            let mypf = { _id: myProfile._id, username: myProfile.username, pfp: myProfile.pfp, customStatus: myProfile.customStatus }

            let friend = await User.findOne(
                {
                    _id: to,
                }
            );
            friend.friends.push({ userID: from, convo: newConvo._id })
            friend.markModified("friends");
            await friend.save();

            let { _id, username, pfp, customStatus } = friend;
            let frnd = { _id, username, pfp, customStatus }

            return { convoInfo: newConvo, me: mypf, partner: frnd, sendTo: to }
        }

    } catch (error) {
        console.log(error)
        return null
    }

}

async function getGroupConvo(from, to) {

    try {

        let myProfile = await User.findOne(
            {
                _id: from,
            }
        );
        let users = myProfile.conversations.filter((group) => to == group)
        if (users.length != 0) {
            let curConvo = await Conversation.findOne({
                _id: users[0],
            });

            let mypf = { _id: myProfile._id, username: myProfile.username, pfp: myProfile.pfp, customStatus: myProfile.customStatus }


            const members = await User.find({ '_id': { $in: curConvo.members } });
            for (let i = 0; i < members.length; i++) {
                let { _id, username, pfp, customStatus } = members[i];
                members[i] = { _id, username, pfp, customStatus }
            }


            return { convoInfo: curConvo, me: mypf, partner: members, sendTo: curConvo.members }
        }
        else {
            return null
        }

    } catch (error) {
        console.log(error)
        return null
    }

}

async function formatMessage(msg, from, to, type) {

    if (msg.type == "img" || msg.type == "vid") {
        console.log(msg.type)
        let prefix = from + Math.random().toString(36).slice(2, 10);
        msg.body.filename = prefix + msg.body.filename.replace(/[^A-Z0-9]+/gi, "_")
        console.log(msg.body)
        await uploadFile(msg.body)
        msg.body = msg.body.filename;
    }

    console.log(to)

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
        mesType:type
    });
}