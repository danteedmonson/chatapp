import React, { useEffect, useState, useRef, useContext } from 'react';
import NewMessage from './NewMessage';
import Textarea from 'react-expanding-textarea'
import { Button, IconButton } from '@material-ui/core';
import { Send as SendIcon, UploadFile } from '@mui/icons-material';
import { SocketContext } from '../../../App';
import { RoomContext } from './RoomContext';



export default function MessageArea(props: any) {
  const [file, setFile] = useState<any>(null)
  const { room } = useContext(RoomContext)

  return (
    <div id="message-area">
      <MessageBox setMedia={props.setMedia} setFile={setFile} myProfile={props.myProfile} members={props.members} setMembers={props.setMembers} />
      <InputArea file={file} setFile={setFile} />
    </div>
  );
}

function MessageBox(props: any) {
  const [chat, setChat] = useState<any>([]);
  const socket = useContext(SocketContext);
  const { room } = useContext(RoomContext)

  useEffect(() => {
    socket.on("receive-message", (message: any) => {

      console.log(props)

      if (message.mesType == "dm") {
        if ((socket.userID == message.from && room._id == message.to) ||
          (socket.userID == message.to && room._id == message.from)

        ) {
          setChat((prev: any) => [message, ...prev])

          switch (message.msg.type) {
            case 'img':
              props.setMedia((prev: any) => [...prev, { _id: message._id, file: "https://danteedmonson-chatapp.s3.amazonaws.com/" + message.msg.body, type: "img" }])
              console.log("THIS IS A TEST")
              break;
            case 'vid':
              props.setMedia((prev: any) => [...prev, { _id: message._id, file: "https://danteedmonson-chatapp.s3.amazonaws.com/" + message.msg.body, type: "vid" }])
          }

          props.setFile(null)
        }
      }
      else if(message.mesType == "group") {
        if (room._id == message.to)  {
          setChat((prev: any) => [message, ...prev])

          switch (message.msg.type) {
            case 'img':
              props.setMedia((prev: any) => [...prev, { _id: message._id, file: "https://danteedmonson-chatapp.s3.amazonaws.com/" + message.msg.body, type: "img" }])
              console.log("THIS IS A TEST")
              break;
            case 'vid':
              props.setMedia((prev: any) => [...prev, { _id: message._id, file: "https://danteedmonson-chatapp.s3.amazonaws.com/" + message.msg.body, type: "vid" }])
          }

          props.setFile(null)
        }

      }
    })
    return () => socket.removeAllListeners()
  }, [room, socket])



  useEffect(() => {
    socket.on("chat-history", (messages: any, members: any) => {

      messages.reverse().forEach((message: any) => {
        switch (message.msg.type) {
          case 'img':
            props.setMedia((prev: any) => [{ _id: message._id, file: "https://danteedmonson-chatapp.s3.amazonaws.com/" + message.msg.body, type: "img" }, ...prev])
            console.log("THIS IS A TEST")
            break;
          case 'vid':
            props.setMedia((prev: any) => [{ _id: message._id, file: "https://danteedmonson-chatapp.s3.amazonaws.com/" + message.msg.body, type: "vid" }, ...prev])
        }

      })



      setChat(messages)
      props.setMembers(members)


    })
    return () => socket.removeAllListeners()
  }, [room])



  return (
    <div style={{ display: "flex", flexDirection: "column-reverse", overflow: "auto", height: "100%", width: "100%" }}>
      <div id="message-box">


        {
          chat.map((message: any, index: number) =>
            <div key={index}>
              <NewMessage chat={chat} currentRoom={room} setMedia={props.setMedia} pfp={props?.members?.find((element: any) => element._id == message.from)?.pfp} mesID={message._id} myProfile={props.myProfile} sender={message.from == socket.userID} body={message.msg.body} type={message.msg.type} />
            </div>
          )
        }


      </div>
    </div>
  );
};



function InputArea(props: any) {
  const [message, setMessage] = useState('');
  const uploadInputRef = useRef<any>(null);
  const [preview, setPreview] = useState<any>(null)
  const socket = useContext(SocketContext);
  const { room } = useContext(RoomContext)


  function sendMessage(event: any) {
    event.preventDefault();

    if (message) {
      socket.emit('send-message', {
        msg: {
          type: "txt",
          body: message,
        },
        to: room._id,
        type: room.type
      });
      setMessage("")
      setPreview(null)
    }

    if (props.file) {
      setPreview(null)

      if (props.file.type.includes("image")) {
        socket.emit('send-message', {
          msg: {
            type: "img",
            body: { file: props.file, filename: props.file.name, type: props.file.type }
          },
          to: room._id,
          type: room.type
        });

      }
      else if (props.file.type.includes("video")) {
        socket.emit('send-message', {
          msg: {
            type: "vid",
            body: { file: props.file, filename: props.file.name, type: props.file.type }
          },
          to: room._id,
          type: room.type
        });
      }


      //- pictureFile = null;
    }
  }


  async function loadFile(event: any) {
    var reader = new FileReader();
    console.log(event.target.files[0]
    )

    if (event.target.files[0]) {

      if (event.target.files[0].size >= 10000000) {
        alert("Image Size too large!")
        event.target.target = null;
        props.setFile(null)
        return;
      }

      if (event.target.files[0].type.includes("image")) {
        console.log("THIS IS AN IMAGE")
        props.setFile(event.target.files[0])
        reader.readAsDataURL(event.target.files[0])
        reader.onload = function (e) {
          var result = reader.result;
          setPreview(result)
        };

      }

      if (event.target.files[0].type.includes("video")) {
        console.log("THIS IS A VIDEO")
        props.setFile(event.target.files[0])
        setPreview("https://cdn.iconscout.com/icon/free/png-256/video-file-85-1120664.png");
      }




    }
  }




  return (
    <div id="input-area">
      <div id="txtA">

        <img src={preview} style={{ width: "200px", height: "auto", margin: 20, display: preview ? "block" : "none" }}></img>
        <div style={{ width: "100%", height: 0.5, backgroundColor: "#FA7268", display: preview ? "block" : "none" }} />
        <Textarea style={{ width: "100%", overflow: "auto", maxHeight: 250 }} rows={1} value={message} onChange={(e) => setMessage(e.currentTarget.value)}></Textarea>
      </div>
      <IconButton type='submit' id='send-button' onClick={sendMessage}>
        <SendIcon />
      </IconButton>


      <input
        type="file"
        id="file-select"
        name='fileupload'
        hidden
        accept="image/*,video/mp4,video/x-m4v,video/*"
        ref={uploadInputRef}
        onChange={loadFile}
      >

      </input>

      <IconButton id='file-button' type="button" onClick={() => uploadInputRef.current && uploadInputRef.current.click()}>
        <UploadFile />
      </IconButton>



    </div>
  );
}
