import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import { io } from "socket.io-client";

const socket: any = io("http://localhost:8000/", { autoConnect: false });

export const SocketContext = React.createContext(socket)

function App() {

  return (
    <SocketContext.Provider value={socket}>
    <div className="App">
    <Router>
          <Routes>
            <Route path ="/"   element={<Login/>}/>
            <Route path ="/Register"  element={<Register/>}/>
            <Route path ="/Dashboard"  element={<Dashboard />}/>
           
          </Routes>
        </Router>
    </div>
    </SocketContext.Provider>
  );
}

export default App;
