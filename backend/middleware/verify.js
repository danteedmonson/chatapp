const jwt = require("jsonwebtoken");
const router = require("express").Router();

/*
    The verify middleware function verifies a
    users jwt
*/

function verify (token) {
    if (!token) {
        return null
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
       return verified;
    }catch(err) {
       return null;
    }
}

module.exports = {verify};