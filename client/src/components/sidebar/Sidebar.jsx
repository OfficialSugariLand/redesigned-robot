import "./sidebar.scss";
import {
    RssFeed, Chat, VideoLibrary, Group,
    HelpOutline, Work
} from "@material-ui/icons";
import CloseFriend from "../closeFriend/CloseFriend";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
    const { user } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const [visible, setVisible] = useState(6);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    /* https://www.youtube.com/watch?v=Ka3OQpwqxXA  {Load more function} */
    const showMorePeople = () => {
        setVisible((prevValue) => prevValue + 6);
    };


    useEffect(() => {
        const getUsers = async () => {
            try {
                const usersList = await axiosInstance.get(`/users/${user.country}/${user.state}`);
                setAllUsers(usersList.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, [user]);

    const pAroundME = allUsers?.filter((p) => p.user_id !== user.user_id)

    return (
        <div className="sidebar">
            <div className="sidebar_container">
                <ul className="sidebar_up_container">
                    <li className="sidebar_top">
                        <RssFeed />
                        <span >Feed</span>
                    </li>
                    <li >
                        <Link to={"/textbox"} className="sidebar_text_messenger">
                            <Chat />
                            <span>Chats</span>
                        </Link>
                    </li>
                    <li>
                        <VideoLibrary />
                        <span >Videos</span>
                    </li>
                    <li >
                        <Group />
                        <span >Agent</span>
                    </li>
                    <li >
                        <HelpOutline />
                        <span >Questions</span>
                    </li>
                    <li >
                        <Work />
                        <span >Hots</span>
                    </li>
                </ul>
                <div className="sidebar_down_container">
                    <h1 >People in your city</h1>
                    <div className="sidebar_friend_list">
                        {pAroundME.slice(0, visible).map((u, id) => (
                            <CloseFriend key={id} people={u} />
                        ))}
                        <button onClick={showMorePeople}>View more</button>
                    </div>
                </div>
            </div>
        </div>
    );
}