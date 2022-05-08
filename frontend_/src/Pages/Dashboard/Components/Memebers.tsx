import { Button, IconButton } from '@material-ui/core';
import { Search, Add } from '@mui/icons-material';
import React, { useState } from 'react';


export default function Members(props: any) {
  const [message, setMessage] = useState('');
  const [pfp, setPfp] = useState('undefinedpyvcfajcBlack_png')
  const [searchMode, setSearchMode] = useState(false);
  const [term, setTerm] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([]);

  const search = (event: any) => {
    //     event.preventDefault();
    //     console.log("trigger")

    //     const searchInfo = JSON.stringify({ term: term })
    //     console.log(searchInfo)
    //     axios({
    //         method: 'post',
    //         url: `${url}/search`,
    //         data: searchInfo,
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     }).then(res => {
    //         // store the returned token into local storage
    //         setSearchedUsers(res.data)

    //     }).catch(err => console.log(err?.response.data))
    // 
  }

  function handleSearch() {
    // if (searchMode) {
    //     setSearchMode(false);
    //     setTerm("")
    //     setSearchedUsers([]);
    // }
    // else {
    //     setSearchMode(true)
    // }
  }



  return (
    <div id="members-section">
      <div style={{ overflow: "auto", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", width: "92%", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ display: searchMode ? "none" : "inline" }}>MEMBERS</h3>
          <form onSubmit={search} id="search-user" style={{ display: !searchMode ? "none" : "flex" }}>
            <input placeholder='Find User' value={term} onChange={(e) => setTerm(e.currentTarget.value)}></input>
            <IconButton id="search-button" type='submit'><Search /></IconButton>
          </form>
          {/* <input id="find-user" style={{display: !searchMode ? "none" : "inline"}}></input> */}
          <IconButton id="add-button" style={{ transform: searchMode ? "rotate(45deg)" : "rotate(0deg)" }} onClick={handleSearch}><Add /></IconButton>
        </div>
        <div style={{ overflow: "auto", width: "100%", height: 450, maxHeight: 450, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>

        {
          props.members.map((element: any) =>
            <Button key={element._id} id='searched-contacts' onClick={() => console.log(element)}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: 30,
                  marginRight: "5%",
                  backgroundImage: `url(https://danteedmonson-chatapp.s3.amazonaws.com/${element.pfp ? element.pfp : pfp})`,
                  backgroundSize: "cover"
                }} />

              {element.username}
              <UserStatus userID={element._id} connected={element.connected} />
            </Button>
          )
        }
        </div>
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
