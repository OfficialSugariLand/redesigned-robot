import "./onlineUser.scss";
import { Link } from 'react-router-dom';
import { io } from "socket.io-client"
import { useEffect, useState } from "react";
import Indicator from "../indicator/Indicator";

export default function OnlineUser({ onlineUsers, currentUser }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [socket, setSocket] = useState(null);
  const [socketData, setSocketData] = useState();

  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", currentUser.user_id);
    //console.log(user)
  }, [socket]);

  useEffect(() => {
    socket?.on("getUsers", (users) => {
      setSocketData(users)
    });
  }, [socket]);

  return (
    <div className="onlineUsers">
      <Link to={"/profile/" + onlineUsers.user_id} style={{ textDecoration: "none" }}>
        <img src={PF + onlineUsers.profilePicture} alt="" />
        <span className="rightbar_Username">{onlineUsers.username}</span>
      </Link>
      {
        socketData?.map((s, socketId) =>
          <Indicator socketUsers={s} key={socketId} onlineUsers={onlineUsers}/>
        )
      }
    </div>
  )
}
