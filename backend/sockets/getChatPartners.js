const { Conversation } = require("../models/Chat");
const User = require("../models/User");
const moment = require("moment");



exports = module.exports = function (io, sessionStore) {
    io.on('connection', (socket) => {
       
        socket.on("all-chat-partners", async () => {

            // format the user message

            // search for convo 
            let chatPartners = await getPartners(
                socket.userID,
            );

            
            sessionStore.findAllSessions().forEach((session) => {

                //console.log(session)
              
                let index = chatPartners.findIndex((user)=>user._id == session.userID)
                
                if(index != -1) {
                    if(session.connected)
                        chatPartners[index].connected = true;
                }

                
            });

            io.to(socket.userID).emit("all-chat-partners", chatPartners);

        });
    })
}

async function getPartners(from) {
    try {
        let myProfile = await User.findOne(
            {
                _id: from,
            }
        );


        let partnersIds = []
        let partnerConvos = []

        for (element of myProfile.friends) {
            partnersIds.push(element.userID)
            partnerConvos.push(element.convo)
        }

        partnerConvos = partnerConvos.reverse();


        const records = await User.find({ '_id': { $in: partnersIds } });        
        for(let i=0; i < records.length; i++) {
            let { _id, username, pfp, customStatus } = records[i];
            records[i] = { _id, username, pfp, customStatus, convo:  partnerConvos[i], connected: false }
        }


        return records;

    } catch (error) {
        console.log(error)
        return null
    }
}

