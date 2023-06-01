import "./likenotice.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export default function Likenotice({ likes }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [likerUsers, setLikerUsers] = useState([]);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Followed Users
    useEffect(() => {
        const getActivityImage = async () => {
            const res = await axiosInstance.get("/users/" + likes?.sender_id);
            setLikerUsers(res.data);
        }
        getActivityImage();
    }, [likes]);

    return (
        <div className="like_notice">
            {
                likerUsers?.map((u, id) =>
                    <div className="like_notice_container" key={id}>
                        <Link to={`/profile/${likes?.sender_id}`}>
                            <img src={u.profilePicture ? PF + u.profilePicture
                                : PF + "person/1658876240053sugarisland.jpeg"} alt=""
                            />
                            <span className="username_container">{u?.username}</span>
                        </Link>
                        <span className="activities_container">{likes?.activities}</span>
                    </div>
                )
            }
            <span className="activity_date_format">{format(likes?.date_time)}</span>
        </div>
    )
}
