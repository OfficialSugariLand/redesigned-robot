import "./online.scss"
import { useState, useEffect } from "react";
import OnlineUser from "./onlineUser/OnlineUser";
import axios from "axios";

export default function Online({ user, curUser }) {
  const [userFriend, setUserFriend] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
  })
  
  //Get all following
    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axiosInstance.get("/followers/");
                setUserFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, []);
	

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axiosInstance.get("/users/" + user?.followed);
        setUserFriend(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  return (
    <div className="rightbarFriend">
      <div className="rightbar_userWrapper">
        {
          userFriend?.map((conUser, id) =>
            <OnlineUser onlineUsers={conUser} currentUser={curUser} key={id} />
          )
        }
      </div>
    </div>
  );
};
