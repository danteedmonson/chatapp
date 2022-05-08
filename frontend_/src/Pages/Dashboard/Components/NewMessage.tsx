import { jsx } from '@emotion/react';
import React, { useEffect, useState } from 'react';

interface mesProp {
  pfp: string,
  sender: boolean,
  body: string,
  type: string,
  myProfile: {
    pfp:string
  },
  mesID: string,
  setMedia:any,
  currentRoom:object,
  chat:[object]
}

export default function NewMessage(props: mesProp) {
  const [message, setMessage] = useState('');
  const [pfp, setPfp] = useState('undefinedpyvcfajcBlack_png')
  //const [element, setElement] = useState<any>()

  let element: any = ""

  useEffect(()=>{
    
  },[])

  switch (props.type) {
    case 'img':
      element=(<img src={"https://danteedmonson-chatapp.s3.amazonaws.com/" + props.body} style={{ height: "auto", width: "290px", borderRadius: 15 }}></img>)
      break;
    case 'vid':
      element=(<video width="300" style={{ borderRadius: 6 }} controls><source src={"https://danteedmonson-chatapp.s3.amazonaws.com/" + props.body} type="video/mp4" /></video>)

      break;
    case 'txt':
      element=(<div style={{maxWidth:"300px", height:"auto", wordWrap:"break-word"}}>{props.body}</div>)
  }  

  
  if (props.sender) {

    return (
      <div className="message" id={props.mesID} key={props.mesID} style={{ flexDirection: "row-reverse" }}>
        <div
          id="pfp-sender"
          style={{
            backgroundImage: `url(https://danteedmonson-chatapp.s3.amazonaws.com/${props.myProfile.pfp ? props.myProfile.pfp : pfp})`,
            backgroundSize: "cover"
          }}/>
        <div id="bubble-sender">
          <div>
            {element}
          </div>
        </div>
      </div>
    )
  }
  else {
    return (

      <div className="message" id={props.mesID} key={props.mesID}>
        <div
          id="pfp"
          style={{
            backgroundImage: `url(https://danteedmonson-chatapp.s3.amazonaws.com/${props.pfp ? props.pfp : pfp})`,
            backgroundSize: "cover"
          }}/>
        <div id="bubble">
          <div>
            {element}
          </div>
        </div>
      </div>
    );


  }
}
