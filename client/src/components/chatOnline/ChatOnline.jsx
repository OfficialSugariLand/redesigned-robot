import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.scss"

export default function ChatOnline({ currentId }) {
    const [friends, setFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("/users/friends/" + currentId);
            setFriends(res.data);
        };

        getFriends();
    }, [currentId]);

    return (
        <div className="chat_online">
            <div className="chat_online_friends">
                <div className="chat_online_img_container">
                    <img src={PF + "person/noimage.png"} alt="" />
                    <div className="chat_online_badge"></div>
                </div>
            </div>
        </div>
    );
}
