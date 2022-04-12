
import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { Button, Checkbox, Link } from '@material-ui/core';
import axios from 'axios';
import { useNavigate } from "react-router";

import "./styles/styles.css"


const url = "http://localhost:8000/api";



export default function Dashboard() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("")
    const navigate = useNavigate();


    // socket.on("connect", () => {
    //     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    // });

    const login = () => {
        const loginInfo = JSON.stringify({
            email: email,
            password: password
        })
        axios({
            method: 'post',
            url: `${url}/user/login`,
            data: loginInfo,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            // store the returned token into local storage
            const jwt = res.data;
            localStorage.setItem('jwt', jwt);

            navigate("../dashboard", { replace: true });
        }).catch(err => {
            if(err?.response)
                setMessage(err?.response.data)
        })
    }

    




    return (
        <div className="login-page">
            <div id="login-box">
                <div id="image-side">
                </div>
                <div id="login-side">
                    <h3>Login</h3>
                    <input type="text" placeholder="Email" onChange={(c) => setEmail(c.target.value)}></input>
                    <input type="password" placeholder="Password" onChange={(c) => setPassword(c.target.value)}></input>
                    <div>
                        <Button id="login-button" onClick={login} disabled={!(email && password)}>Login</Button>
                        <div id='remember'>
                            <span >
                                <Checkbox />
                                Remember Me
                            </span>

                            <Link href='#' onClick={()=>navigate("../register", { replace: true })} id="register-link">Register?</Link>
                        </div>
                        <span id='error'>{message}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
