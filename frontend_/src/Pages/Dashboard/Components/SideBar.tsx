import React, { useState } from 'react';
import Groups from './Groups';
import MessageHistory from './MessageHistory';
import Profile from './Profile';

export default function SideBar(props: any) {
  const [message, setMessage] = useState('');


  return (
    <>
      <Profile  props={props}/>
      <MessageHistory  props={props}/>
      <Groups />
    </>
  );
}
