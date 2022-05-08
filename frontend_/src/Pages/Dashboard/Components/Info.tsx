import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { RoomContext } from './RoomContext';


export default function InfoBar({currentRoom}:any) {
  const {room} = useContext(RoomContext)

  useEffect(()=>{
    console.log(room)
  },[room])

  return (
    <div id="infobar">
        <div style={{ display: "flex", width: "95%", justifyContent: "space-between" }}>
        <h2 style={{ display: "inline" }}>{room?.username?.toUpperCase()}</h2>
      </div>
    </div>
  );
}
