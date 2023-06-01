import "./online.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import noimage from "./noimageavater/noimage.png";
import socketIOClient from "socket.io-client";

export default function Online({ onlineFriend }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [socketUsers, setSocketUsers] = useState();
  const [userFriend, setUserFriend] = useState([]);
  let isRendered = useRef(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  })

  //Use socket
  useEffect(() => {
    const socket = socketIOClient("http://localhost:4000/");
    socket?.on("getUsers", (data) => {
      setSocketUsers({
        user_id: data.user_id
      });
    });
  }, []);

  useEffect(() => {
    isRendered = true;
    axiosInstance
      .get(`/users/${onlineFriend?.followed}`)
      .then(res => {
        if (isRendered) {
          setUserFriend(res.data.sort((p1, p2) => {
            return new Date(p2.date_time) - new Date(p1.date_time);
          })
          );
        }
        return null;
      })
      .catch(err => console.log(err));
    return () => {
      isRendered = false;
    };
  }, [onlineFriend]);

  return (
    <div className="rightbarFriend">
      {
        userFriend?.map((onlineUsers, id) =>
          <div className="online_friends" key={id}>
            {
              onlineUsers?.user_id === socketUsers?.user_id &&
              <Link to={"/profile/" + onlineUsers?.user_id} style={{ textDecoration: "none" }}>
                <div className="img_online">
                  <img src={onlineUsers.profilePicture ? PF + onlineUsers.profilePicture : noimage} alt="" />
                  <span className="rightbarOnline"></span>
                </div>
                <span className="rightbar_Username">{onlineUsers.username}</span>
              </Link>
            }
          </div>
        )
      }
    </div>
  );
};
