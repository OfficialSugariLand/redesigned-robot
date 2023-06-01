import "./rightbar.scss";
import { AuthContext } from "../../context/AuthContext";
import Online from "../online/Online";
import axios from "axios";
import { useContext, useState, useEffect, useRef } from "react";

export default function Rightbar() {
  const { user } = useContext(AuthContext);
  let isRendered = useRef(false);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [visible, setVisible] = useState(6);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    isRendered = true;
    axiosInstance
      .get("/followers/" + user.user_id)
      .then(res => {
        if (isRendered) {
          setOnlineFriends(res.data);
        }
        return null;
      })
      .catch(err => console.log(err));
    return () => {
      isRendered = false;
    };
  }, [user]);

  //Remove my user from followed list
  const [newOnlineFriends, setNewOnlineFriends] = useState([]);
  useEffect(() => {
    const newFriends = onlineFriends?.filter((f) => f.followed !== user.user_id);
    setNewOnlineFriends(newFriends);
  }, [onlineFriends]);

  const showMorePeople = () => {
    setVisible((prevValue) => prevValue + 6);
  };

  //console.log(newFriends)

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
            {newOnlineFriends?.slice(0, visible).map((u, id) => (
              <Online key={id} onlineFriend={u} />
            ))}
            <button onClick={showMorePeople}>View more</button>
          </ul>
        </div>
      </div>
    </div>
  );
};