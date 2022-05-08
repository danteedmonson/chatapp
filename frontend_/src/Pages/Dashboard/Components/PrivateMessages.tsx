import React, {  useState, useContext } from 'react';
import { Button, IconButton, TextField, InputAdornment } from '@material-ui/core';
import { Add, Search } from '@mui/icons-material';
import axios from 'axios';
import { SocketContext } from '../../../App';
import { RoomContext } from './RoomContext';


interface RoomInterface {
    _id: string, username: string, convo: string
}

export default function PrivateMessages(props : any) {
    const [message, setMessage] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const [term, setTerm] = useState('')
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [pfp, setPfp] = useState('undefinedpyvcfajcBlack_png')
    const socket = useContext(SocketContext);
    const {setRoom} = useContext(RoomContext)

    // onlineUsers
    const [isOnline, setIsOnline] = useState("grey")

    const url = "http://localhost:8000/api";

    const search = (event: any) => {
        event.preventDefault();
        console.log("trigger")

        const searchInfo = JSON.stringify({ term: term })
        console.log(searchInfo)
        axios({
            method: 'post',
            url: `${url}/search`,
            data: searchInfo,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            // store the returned token into local storage
            setSearchedUsers(res.data)

        }).catch(err => console.log(err?.response.data))
    }

    function handleSearch() {
        if (searchMode) {
            setSearchMode(false);
            setTerm("")
            setSearchedUsers([]);
        }
        else {
            setSearchMode(true)
        }
    }

    function handleMessageButton({_id, username, convo}: RoomInterface) {

        setRoom({_id, username, convo, type:"dm"})
        console.table({_id, username, convo, type:"dm"})
        props.setMedia([])
        setSearchMode(false);
        setTerm("")
        setSearchedUsers([]);
        setCurrentUser(null)
    }

    function getMessages({_id, username, convo}: RoomInterface) {
       
        setRoom({_id, username, convo, type: "dm"})
        console.table({_id, username, convo, type:"dm"})
        props.setMedia([])
        socket.emit('chat-history', convo)
    }

    if (currentUser) {
        return <UserProfile currentUser={currentUser} setCurrentUser={setCurrentUser} handle={handleMessageButton} />
    }






    return (
        <div id="messages-section">
            <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "column" }}>

                <div style={{ display: "flex", width: "92%", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ display: searchMode ? "none" : "inline" }}>MESSAGES</h3>
                    <form onSubmit={search} id="search-user" style={{ display: !searchMode ? "none" : "flex" }}>
                        <input placeholder='Find User' value={term} onChange={(e) => setTerm(e.currentTarget.value)}></input>
                        <IconButton id="search-button" type='submit'><Search /></IconButton>
                    </form>


                    {/* <input id="find-user" style={{display: !searchMode ? "none" : "inline"}}></input> */}
                    <IconButton id="add-button" style={{ transform: searchMode ? "rotate(45deg)" : "rotate(0deg)" }} onClick={handleSearch}><Add /></IconButton>
                </div>
                {
                    !searchMode ?
                        <div style={{ overflow: "auto", width: "100%", height: 250, maxHeight: 250, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                            {
                                props.chatPartners.map((element: any) =>
                                    <Button key={element._id} id='searched-contacts' onClick={() => getMessages(element)}>
                                        <div
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: 30,
                                                marginRight: "5%",
                                                backgroundImage: `url(https://danteedmonson-chatapp.s3.amazonaws.com/${element.pfp ? element.pfp : pfp})`,
                                                backgroundSize: "cover"
                                            }}>
                                        </div>

                                        {element.username}
                                        <UserStatus userID={element._id} connected={element.connected} />
                                    </Button>
                                )
                            }
                        </div>
                        :
                        <>
                            <div style={{ overflow: "auto", width: "100%", height: 250, maxHeight: 250, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                                {
                                    searchedUsers.map((element: any) =>
                                        <Button key={element._id} id='searched-contacts' onClick={() => setCurrentUser(element)}>
                                            <div
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    borderRadius: 30,
                                                    marginRight: "5%",
                                                    backgroundImage: `url(https://danteedmonson-chatapp.s3.amazonaws.com/${element.pfp ? element.pfp : pfp})`,
                                                    backgroundSize: "cover"
                                                }}>
                                            </div>

                                            {element.username}
                                        </Button>
                                    )
                                }
                            </div>
                        </>
                }
            </div>
        </div>
    );
}

function UserStatus({ userID, connected }: any) {
    return <div id={userID} style={{
        width: "14px", height: "14px", borderRadius: "50%",
        backgroundColor: connected ? "green" : "grey", position: "absolute",
        right: 10
    }} />
}

function UserProfile({ currentUser, setCurrentUser, handle }: any) {
    const [pfp, setPfp] = useState('undefinedpyvcfajcBlack_png')

    console.log(currentUser)
    return (

        <div id="messages-section">
            <div style={{
                backgroundColor: "#FA7268",
                position: "absolute", width: "100%",
                height: "19%", top: 0, display: "flex",
                justifyContent: "center", alignItems: "center"
            }}>
                {currentUser.username.toUpperCase()}
            </div>
            <div style={{ display: "flex", width: "100%", height: "100%", paddingLeft: 20, paddingTop: 20, zIndex: 1000 }}>
                <div style={{
                    width: "70px", height: "70px", backgroundColor: "black",
                    borderRadius: "50%", marginRight: "5%", border: "1px solid #181c2c",
                }}
                >
                    {currentUser.pfp &&
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 30,
                                marginRight: "5%",
                                backgroundImage: `url(https://danteedmonson-chatapp.s3.amazonaws.com/${currentUser.pfp ? currentUser.pfp : pfp})`,
                                backgroundSize: "cover"
                            }}>
                        </div>
                    }
                </div>

            </div>
            <div style={{ alignSelf: "flex-end" }}>
                <Button style={{ color: "red", margin: 15 }} onClick={() => setCurrentUser(null)}>Cancel</Button>

                <Button
                    style={{ color: "white", border: "1px solid white", margin: 15 }}
                    variant='outlined' onClick={() => handle(currentUser)}
                >
                    Message
                </Button>

            </div>

        </div>


    )
}
