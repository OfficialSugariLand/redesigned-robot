import "./rightbar.scss"
import Online from "../online/Online";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Rightbar() {
  const { user } = useContext(AuthContext);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [visible, setVisible] = useState(6);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const getOnlineFriends = async () => {
      try {
        const friendList = await axiosInstance.get("/followers/" + user.user_id);
        setOnlineFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getOnlineFriends();
  }, [user]);

  //Remove my user from followed list
  const newFriends = onlineFriends?.filter((f) => f.followed !== user.user_id);

  //console.log(onlineFriends)

  const showMorePeople = () => {
    setVisible((prevValue) => prevValue + 6);
  };

  //console.log(socketData)

  return (
    <div className="rightbar">
      <div className="rightbar_container">
        <div className="rightbar_add_container">
          <span >Sponsored Ads</span>
          <img src="assets/ad.jpg" alt="" />
        </div>
        <div className="rightbar_friends_container">
          <h4>Online Friends</h4>
          <ul >
            {newFriends.slice(0, visible).map((u, id) => (
              <Online key={id} /* user={u} */ user={user} />
            ))}
            <button onClick={showMorePeople}>View more</button>
          </ul>
        </div>
      </div>
    </div>
  );
};