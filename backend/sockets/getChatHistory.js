const { Conversation } = require("../models/Chat");
const User = require("../models/User");
const moment = require("moment");




exports = module.exports = function (io, sessionStore) {
    io.on('connection', (socket) => {
        socket.on("chat-history", async (convoID) => {

            // format the user message


            // search for convo 
            let convoInfo = await getConvo(
                convoID,
            );

            

            let memebers = await getPartners(
                convoInfo.members,
                sessionStore
            );

            console.log(memebers)

            console.log(convoInfo.content)
            io.to(socket.userID).emit("chat-history", convoInfo.content, memebers);

        });
    })
}

async function getConvo(convoID) {
    try {

        let curConvo = await Conversation.findOne({
            _id: convoID,
        });
        return curConvo

    } catch (error) {
        console.log(error)
        return null
    }
}


async function getPartners(partnersIds, sessionStore) {
    try {
       
        const records = await User.find({ '_id': { $in: partnersIds } });        
        for(let i=0; i < records.length; i++) {
            let { _id, username, pfp, customStatus } = records[i];
            records[i] = { _id, username, pfp, customStatus, connected: false }
        }

        sessionStore.findAllSessions().forEach((session) => {
            let index = records.findIndex((user)=>user._id == session.userID)
            if(index != -1) {
                if(session.connected)
                records[index].connected = true;
            }  
        });

        return records;

    } catch (error) {
        console.log(error)
        return null
    }
}
