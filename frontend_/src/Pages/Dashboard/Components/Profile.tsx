import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { SocketContext } from '../../../App';

export default function Profile(props: any) {
  const [message, setMessage] = useState('');
  const pfpRef = useRef<any>(null)
  const [preview, setPreview] = useState<any>(null)
  const [pfp, setPfp] = useState('undefinedpyvcfajcBlack_png')
  const [username, setUsername] = useState('')
  const [file, setFile] = useState<any>(null)
  const url = "http://localhost:8000/api";
  const socket = useContext(SocketContext);



  useEffect(() => {
    const jwt: any = localStorage.getItem('jwt');

    axios.get(url + '/getuser', {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': jwt
      }
    }).then((res) => {
      console.log(res.data)
      res.data.pfp && setPfp(res.data.pfp)
      props.setMyProfile(res.data)
      setUsername(res.data.username.toUpperCase())

    }).catch((err) => console.log(err))

  }, [])


  async function loadFile(event: any) {
    var reader = new FileReader();
    console.log(event.target.files[0]
    )
    if (event.target.files[0]) {
      if (event.target.files[0].size >= 10000000) {
        alert("Image Size too large!")
        event.target.files[0] = null;
        setFile(null)
        return;
      }
      if (event.target.files[0].type.includes("image")) {
        console.log("THIS IS AN IMAGE")
        setFile(event.target.files[0])
        reader.readAsDataURL(event.target.files[0])
        reader.onload = function (e) {
          var result = reader.result;
          setPreview(result)
        };
      }
    }
  }

  function uploadImage() {
    const jwt: any = localStorage.getItem('jwt');

    console.log(file)
    if (!file) {

      return
    }



    let data =
    {
      file: file,
      filename: file.name,
      type: file.type
    };

    socket.emit("pfp-upload", { data, jwt })



  }


  return (

    <div id="profile-section">

      <input type="file" onChange={loadFile} hidden ref={pfpRef}></input>
      <div style={{ display: "flex", width: "92%", justifyContent: "space-between" }}>
        <h3 style={{ display: "inline" }}>{username}</h3>
      </div>
      <div style={{ overflow: "auto", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>

        <div
          id="my-pfp"
          onClick={() => pfpRef.current.click()}
          style={{ backgroundImage: preview ? `url(${preview})` : `url(https://danteedmonson-chatapp.s3.amazonaws.com/${pfp})`, backgroundSize: "cover" }}>
        </div>
      </div>

      <Button onClick={uploadImage}>save</Button>    </div>


  );
}
