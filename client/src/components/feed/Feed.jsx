import "./feed.scss";
import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

export default function Feed({ username }) {
  const { user } = useContext(AuthContext);
  const user_id = useParams().user_id;
  const [friendPosts, setFriendPosts] = useState([]);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });


  //Fetch friends timeline posts
  let isRendered = useRef(false);
  useEffect(() => {
    isRendered = true;
    axiosInstance
      .get(`/posts/friends/${user.user_id}`)
      .then(res => {
        if (isRendered) {
          setFriendPosts(res.data.sort((p1, p2) => {
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
  }, [user, ignored]);
  /* useEffect(() => {
    const fetchPosts = async () => {
      const res = await axiosInstance.get("/posts/friends/" + user.user_id);
      setLoading(true)
      setFriendPosts(res.data.sort((p1, p2) => {
        return new Date(p2.date_time) - new Date(p1.date_time);
      })
      );
    };
    fetchPosts();
  }, [user, ignored]); */

  //Remove duplicates
  const newPosts = friendPosts?.filter((ele, ind) => ind === friendPosts?.findIndex(elem => elem.id === ele.id &&
    elem.user_id === ele.user_id && elem.follower === user.user_id));

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!user_id || user_id === user?.user_id) && <Share username={username} ignored={ignored} forceUpdate={forceUpdate} />}
        {newPosts.map((p, id) => (
          <Post post={p} currentUser={user} key={id} ignored={ignored} forceUpdate={forceUpdate} />
        ))}
      </div>
    </div>
  );
}