const { Conversation } = require("../models/Chat");
const User = require("../models/User");
const moment = require("moment");



exports = module.exports = function (io, sessionStore) {
    io.on('connection', (socket) => {
       
        socket.on("create-group", async (groupName) => {
            // create a new group
            let group = await createGroup(groupName, socket.userID)
            console.log(group)
            io.to(socket.userID).emit("create-group", group);

        });
    })
}

async function createGroup(groupName, me) {
    try {
        let newGroup = new Conversation({
            members: [me],
            convoType: "group",
            content:[],
            name: groupName,
        })
        await newGroup.save();

        let myProfile = await User.findOne({
            _id: me
        })

        myProfile.conversations.push(newGroup._id);
        myProfile.markModified("conversations");
        await myProfile.save();

        return newGroup;

    } catch (error) {
        console.log(error)
        return null
    }
}