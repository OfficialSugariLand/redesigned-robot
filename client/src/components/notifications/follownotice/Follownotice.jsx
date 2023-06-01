import "./followed.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export default function Follownotice({ followers }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [followerUsers, setFollowerUsers] = useState([]);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Followed Users
    useEffect(() => {
        const getActivityImage = async () => {
            const res = await axiosInstance.get("/users/" + followers?.follower_id);
            setFollowerUsers(res.data);
        }
        getActivityImage();
    }, [followers]);

    return (
        <div className="followed">
            {
                followerUsers?.map((u, id) =>
                    <div className="user_followed_container" key={id}>
                        <Link to={`/profile/${followers?.follower_id}`}>
                            <img src={u.profilePicture ? PF + u.profilePicture
                                : PF + "person/1658876240053sugarisland.jpeg"} alt=""
                            />
                        </Link>
                        <span className="username_contain">{u?.username}</span>
                        <span className="activities_contain">{followers?.activities}</span>
                        <span className="followed_date_format">{format(followers?.date_time)}</span>
                    </div>
                )
            }
        </div>
    )
}
