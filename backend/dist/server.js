"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
let cors = require('cors');
const express = require('express');
const mongoose = require('mongoose'); // import mongoose module - library for mongoDB
const { verify } = require("../middleware/verify");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const authRoute = require('../routes/auth');
const search = require('../routes/search');
const getuser = require('../routes/getuser');
const { Conversation, Message } = require("../models/Chat");
const User = require("../models/User");
const moment = require("moment");
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    maxHttpBufferSize: 1e7,
    pingTimeout: 30000
});
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to db!'));
app.use('/api/user', authRoute);
app.use('/api/', search);
app.use('/api/', getuser);
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();
const getChatPartners = require('../sockets/getChatPartners')(io, sessionStore);
const sendMessage = require('../sockets/sendMessage')(io);
const getChatHistory = require('../sockets/getChatHistory')(io, sessionStore);
const pfp = require('../routes/pfp')(io);
io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            console.log("HERE 1");
            console.log(socket.handshake.auth);
            return next();
        }
    }
    const token = socket.handshake.auth.token;
    const userID = verify(token);
    if (!userID) {
        return next(new Error("invalid username"));
    }
    socket.sessionID = randomId();
    socket.userID = userID._id;
    console.log("HERE 2");
    console.log(socket.userID);
    next();
});
io.on('connection', (socket) => {
    console.log('a user connected');
    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        connected: true,
    });
    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });
    socket.join(socket.userID);
    const users = [];
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userID: session.userID,
            username: session.username,
            connected: session.connected,
        });
    });
    socket.emit("users", users);
    socket.broadcast.emit("user connected", {
        userID: socket.userID,
        connected: true,
    });
    // socket.on("send-message", ({ content, to }:any) => {
    //   console.log(socket.userID)
    //   io.to(to).to(socket.userID).emit("receive-message", {
    //     content,
    //     from: socket.userID,
    //     to,
    //   });
    // });
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        const matchingSockets = yield io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID);
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: false,
            });
        }
    }));
});
server.listen(8000, () => {
    console.log('listening on *:8000');
});
