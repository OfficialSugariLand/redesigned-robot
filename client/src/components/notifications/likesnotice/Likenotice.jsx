import "./likenotice.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export default function Likenotice({ likeCount, likeDrop }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [likerUsers, setLikerUsers] = useState([]);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    //Followed Users
    useEffect(() => {
        const getActivityImage = async () => {
            const res = await axiosInstance.get("/users/" + likeCount?.sender_id);
            setLikerUsers(res.data);
        }
        getActivityImage();
    }, [likeCount]);

    // delete followed count
    setTimeout(() => {
        if (likeDrop === true) {
            const deleteNotification = async () => {
                try {
                    await axiosInstance.delete("/likenotice/" + likeCount?.id, {
                        data: {
                            id: likeCount?.id,
                        },
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            deleteNotification();
        }
    }, 500);


    return (
        <div className="like_notice">
            {
                likerUsers?.map((u, id) =>
                    <div className="like_notice_container" key={id}>
                        <Link to={`/profile/${likeCount?.sender_id}`}>
                            <img src={u.profilePicture ? PF + u.profilePicture
                                : PF + "person/1658876240053sugarisland.jpeg"} alt=""
                            />
                            <span className="username_container">{u?.username}</span>
                        </Link>
                        <span className="activities_container">{likeCount?.activities}</span>
                    </div>
                )
            }
            <span className="activity_date_format">{format(likeCount?.date_time)}</span>
        </div>
    )
}
