import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Followings({ userFriends }) {
    const [userFriend, setUserFriend] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [visible] = useState(6);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    useEffect(() => {
        const getFriends = async () => {
            try {
                const friendList = await axiosInstance.get("/users/" + userFriends?.followed);
                setUserFriend(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [userFriends]);

    return (
        <div>
            {userFriend?.slice(0, visible)?.map((friend) => (
                <Link to={"/profile/" + friend.user_id} key={friend.id}>
                    <div className="rightbarFollowing">
                        <img src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noimage.png"} alt="" />
                        <span>{friend.username}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}
