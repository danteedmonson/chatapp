import { useState, createContext, useContext } from "react";

interface Props {
    children: JSX.Element[]
}

interface RoomContextInterface {
    room:{
        username: string,
        _id: string[] | string,
        convo: string,
        type: string
    },
    setRoom: React.Dispatch<React.SetStateAction<RoomContextInterface["room"]>> 
}

const appCtxDefaultValue = {
    room: {username:"", _id:"", convo:"", type: ""},
    setRoom: () => {} // noop default callback
  };

export const RoomContext = createContext<RoomContextInterface>(appCtxDefaultValue);
export function RoomProvider(props: Props) {
    const [room, setRoom] = useState<RoomContextInterface["room"]>({username:"", _id:"", convo:"", type: ""});

    return (
        <RoomContext.Provider value={{room, setRoom}}>
            {props.children}
        </RoomContext.Provider>
    )
}