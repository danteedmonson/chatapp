import React, { useState, useContext, useEffect } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { Add } from '@mui/icons-material';
import { SocketContext } from '../../../App';
import { RoomContext } from './RoomContext';


interface groupProps {
    groups: {
        _id: string[],
        username: string,
        convo: string
    }[],
    setCurrentRoom: React.Dispatch<React.SetStateAction<string>>,
    setMedia: React.Dispatch<React.SetStateAction<{
        _id: string;
        file: string;
        type: string;
    }[]>>
}
export default function Groups({groups, setCurrentRoom, setMedia}: groupProps) {
    const [groupName, setGroupName] = useState('testGroup');
    const socket = useContext(SocketContext);
    const {setRoom} = useContext(RoomContext)

    function createGroup() {
        console.log(groupName)
        socket.emit('create-group', groupName)
    }


    useEffect(()=>{
        socket.on('create-group',(group: groupProps["groups"])=>{
            console.log(group)
        })
    },[])
    
    function getMessages({_id, username, convo}: {_id:string[], username: string, convo:string}) {
       
        setRoom({_id, username, convo, type:"group"})
        setMedia([]);
        socket.emit('chat-history', convo)
    }


    return (



        <div id="group-section">
            <div style={{ display: "flex", width: "100%", height:"100%", justifyContent: "space-between", alignItems:"center", flexDirection: "column" }}>
                <div style={{ display: "flex", width: "92%", justifyContent: "space-between" }}>
                    <h3 style={{ display: "inline" }}>GROUPS</h3>
                    <IconButton id="add-button" onClick={createGroup}><Add /></IconButton>                
                </div>
                <div  style={{ overflow: "auto", width: "100%", height: 250, maxHeight: 250, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                    {
                        groups.map((element: {_id:string[], username: string, convo:string}) =>
                        <Button key={element.convo} id='searched-contacts' onClick={()=>getMessages(element)}>
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: 30,
                            marginRight: "5%",
                            backgroundSize: "cover"
                          }}>~</div>
          
                        {element.username}
                      </Button>
                        )
                    }

                </div>
            </div>
        </div>

    );
}
