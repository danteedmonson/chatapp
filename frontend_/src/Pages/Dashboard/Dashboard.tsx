import React, { useEffect, useState, useContext } from 'react';
import NavigationBar from './Components/NavigationBar';
import FileBar from './Components/Media';
import InfoBar from './Components/Info';
import './styles/styles.css'
import MessageArea from './Components/MessageArea';
import Members from './Components/Memebers';
import { SocketContext } from '../../App';
import PrivateMessages from './Components/PrivateMessages';
import Profile from './Components/Profile';
import GroupsArea from './Components/Groups';
import { RoomProvider } from './Components/RoomContext'

interface userInfo {
  chatPartner: {
    _id: string,
    username: string,
    pfp: string,
    customStatus: string,
    convo: string,
    connected: boolean
  },
  group: {
    _id: string[],
    username: string,
    convo: string
  },
  myProfile: {
    customStatus: string,
    pfp: string,
    _id?: string,
  },
  media: {
    _id: string,
    file: string,
    type: string
  }[]

}

export default function Dashboard() {
  const [onlineUsers, setOnlineUsers] = useState<{ userID: string, connected: boolean }[]>([])
  const [chatPartners, setChatPartners] = useState<userInfo['chatPartner'][]>([])
  const [groups, setGroups] = useState<userInfo['group'][]>([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [members, setMembers] = useState([]);
  const [myProfile, setMyProfile] = useState<userInfo['myProfile']>()
  const [media, setMedia] = useState<userInfo['media']>([]);
  const socket = useContext(SocketContext);

  socket.on('connect', () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });

  useEffect(() => {

    const sessionID = localStorage.getItem('sessionID');
    //localStorage.removeItem('sessionID')
    const token = localStorage.getItem('jwt');



    if (sessionID) {
      //this.usernameAlreadySelected = true;
      socket.auth = { sessionID, token };
      socket.connect();
    }
    else {
      socket.auth = { token };
      socket.connect();

    }
  }, [])

  socket.on('session', ({ sessionID, userID }: { sessionID: string, userID: string }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    localStorage.setItem('sessionID', sessionID);
    // save the ID of the user
    socket.userID = userID;
    console.log(userID)
  });

  useEffect(() => {

    socket.on('users', (users: { userID: string, connected: boolean }[]) => {
      console.log(users)

      setOnlineUsers(users);
      console.log(onlineUsers)
    })
  }, [chatPartners])

  useEffect(() => {

    socket.on('chat-partner', (user: userInfo['chatPartner']) => {
      console.log(user)
      let temp = chatPartners.filter((element: userInfo['chatPartner']) => user._id == element._id)[0]
      if (temp)
        setChatPartners((prev) => [user, ...prev]);
    })

    return () => socket.off('chat-partner');

  }, [])

  useEffect(() => {

    socket.emit('all-chat-partners')

    socket.on('all-chat-partners', (convos: { chatPartners: userInfo["chatPartner"][], groups: userInfo["group"][] }) => {
      console.table(convos.chatPartners)
      console.table(convos.groups)
      setChatPartners(convos.chatPartners);
      setGroups(convos.groups)
    })



    return () => socket.off('all-chat-partners');

  }, [])

  useEffect(() => {

    socket.on('user connected', (user: { userID: string, connected: boolean }) => {
      console.log(user)
      let userStatus: HTMLElement | null = document.getElementById(user.userID)
      if (userStatus)
        userStatus.style.backgroundColor = 'green'
      setOnlineUsers((prev: { userID: string, connected: boolean }[]) => [...prev, user])

    })

  }, [])

  useEffect(() => {
    socket.on('user disconnected', (user: string) => {
      console.log(user + ' discon')
      let userStatus: HTMLElement | null = document.getElementById(user)
      if (userStatus)
        userStatus.style.backgroundColor = 'grey'
      setOnlineUsers((prev: { userID: string, connected: boolean }[]) => prev.filter((value: { userID: string, connected: boolean }) => user != value.userID))
    })
  }, [])



  return (
    <div id='dash'>
      <RoomProvider>
        
        <Profile setMyProfile={setMyProfile} />
        <PrivateMessages onlineUsers={onlineUsers} setMedia={setMedia} setCurrentRoom={setCurrentRoom} chatPartners={chatPartners} />
        <GroupsArea setMedia={setMedia} setCurrentRoom={setCurrentRoom} groups={groups} />
        <MessageArea currentRoom={currentRoom} setMedia={setMedia} socket={socket} members={members} setMembers={setMembers} myProfile={myProfile} />
        <InfoBar currentRoom={currentRoom} />
        <FileBar media={media} />
        <Members members={members} />
      </RoomProvider>
    </div>
  );
}
