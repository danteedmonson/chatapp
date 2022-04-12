import React, { useState } from 'react';


export default function InfoBar({currentRoom}:any) {
  

  return (
    <div id="infobar">
        <div style={{ display: "flex", width: "95%", justifyContent: "space-between" }}>
        <h2 style={{ display: "inline" }}>{currentRoom?.username?.toUpperCase()}</h2>
      </div>
    </div>
  );
}
