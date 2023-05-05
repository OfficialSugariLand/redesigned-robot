import "./online.scss";
import { useState, useEffect, useRef } from "react";
import OnlineUser from "./onlineUser/OnlineUser";
import axios from "axios";

export default function Online({ onlineFriend }) {
  const [userFriend, setUserFriend] = useState([]);
  let isRendered = useRef(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  })

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
      <div className="rightbar_userWrapper">
        {
          userFriend?.map((conUser, id) =>
            <OnlineUser onlineUsers={conUser} key={id} />
          )
        }
      </div>
    </div>
  );
};
