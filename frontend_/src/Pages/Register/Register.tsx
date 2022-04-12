
import React, { useState } from 'react';
import { io } from "socket.io-client";
import { Button, Checkbox, Link } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from "react-router";

import "./styles/styles.css"


const socket = io("http://localhost:8000/", { autoConnect: false });
const url = "http://localhost:8000/api";



export default function Dashboard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("")
    const navigate = useNavigate();


    socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    const register = (event:any) => {
        event.preventDefault();
        const registerInfo = JSON.stringify({
            email: email,
            password: password,
            username: username 
        })
        axios({
            method: 'post',
            url: `${url}/user/register`,
            data: registerInfo,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            console.log(res.data)
            // store the returned token into local storage
            const jwt = res.data;
            localStorage.setItem('jwt', jwt);
            //navigate("../dashboard", { replace: true });
        }).catch(err => setMessage(err.response.data))
    }


    return (
        <div className="register-page">
            <div id="register-box">

                <form id="register-side" autoComplete="off" onSubmit={register}>
                    <h3>Register</h3>
                        <input autoComplete="false" name="hidden" type="text" style={{display:"none"}}/>
                        <input type="text" placeholder="username" onChange={(c) => setUsername(c.target.value)}></input>
                        <input type="text" placeholder="email" autoComplete="new-email"  onChange={(c) => setEmail(c.target.value)}></input>
                        <input type="password" placeholder="password" autoComplete="new-password" onChange={(c) => setPassword(c.target.value)}></input>

                        <div>
                            <Button id="register-button" type='submit' disabled={!(email && password)}>Register</Button>
                            <div id='remember'>
                                <span >
                                    <Checkbox />
                                    Remember Me
                                </span>

                                <Link href='#' onClick={() => navigate("../", { replace: true })} id="login-link">Login?</Link>
                            </div>
                            <span id='error'>{message}</span>
                        </div>
                 

                </form>
                <div id="image-side-reg">
                </div>
            </div>
        </div>
    );
}
