const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  
    from:String,
    to:  String,
    msg: Object,
    mesType: String
  },{ versionKey: false });
  
  const conversationSchema = new Schema({
    members:Array,
    convoType: String,
    name: String,
    content: [messageSchema],
    lastModified: Date
  },{ versionKey: false });
  
  
  const Message = mongoose.model("Message", messageSchema);
  const Conversation = mongoose.model("Conversation", conversationSchema);
  module.exports = {Conversation, Message};
  