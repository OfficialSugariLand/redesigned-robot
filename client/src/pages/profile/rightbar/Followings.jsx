import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Followings({ userFriends }) {
    const [userFriend, setUserFriend] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let isRendered = useRef(false);
    const [visible] = useState(6);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${userFriends?.followed}`)
            .then(res => {
                if (isRendered) {
                    setUserFriend(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [userFriends]);

    return (
        <div>
            {userFriend?.slice(0, visible)?.map((friend, id) => (
                <Link to={"/profile/" + friend.user_id} key={id}>
                    <div className="rightbarFollowing">
                        <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noimage.png"} alt="" />
                        <span>{friend.username}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}
