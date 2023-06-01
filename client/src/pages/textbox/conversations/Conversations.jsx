import "./conversations.scss";
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import noimage from "./noimageavater/noimage.png";
import socketIOClient from "socket.io-client";

function Conversations({ conversation, ignored }) {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    let isRendered = useRef(false);
    const [chatUser, setChatUser] = useState([]);
    const [unreadText, setUnreadtText] = useState();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });


    //Use socket oi to send and get texts instant
    const [arrivalUnread, setArrivalUnread] = useState();
    useEffect(() => {
        const socket = socketIOClient("http://localhost:4000/");
        socket?.on("getUnreadTexts", (data) => {
            setArrivalUnread({
                sender_id: data.sender_id,
                receiver_id: data.receiver_id
            });
        });
    }, []);

    //Real time conversation rerender
    useEffect(() => {
        arrivalUnread &&
            user.user_id === arrivalUnread?.receiver_id &&
            setUnreadtText((prev) => [prev, arrivalUnread]);
    }, [arrivalUnread, user.user_id]);

    //Get conversation users
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/users/${conversation.user_two}`)
            .then(res => {
                if (isRendered) {
                    setChatUser(res.data);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [conversation]);

    //Get unread texts
    useEffect(() => {
        isRendered = true;
        axiosInstance
            .get(`/unreadtexts/${user.user_id}/${conversation?.user_two}`)
            .then(res => {
                if (isRendered) {
                    setUnreadtText(res.data[0]);
                }
                return null;
            })
            .catch(err => console.log(err));
        return () => {
            isRendered = false;
        };
    }, [user.user_id, conversation?.user_two, ignored]);

    //console.log(unreadText)

    return (
        <div className="conversation">
            {
                chatUser?.map((c, id) =>
                    <div className={`${unreadText?.sender_id === c.user_id ? "unread_texts" : "conversation_users"}`} key={id}>
                        <Link to={`/textbox/sugarchat/${c.user_id}`}>
                            <img src={c.profilePicture ? PF + c.profilePicture : noimage} alt="" />
                            <div className="text_preview">
                                <span className="chat_user_name">{c.username}</span>
                                <p>{conversation.last_text?.substr(0, 35)}
                                    {
                                        conversation.last_text?.length > 35 &&
                                        <span>....</span>
                                    }
                                </p>
                            </div>
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

export default Conversations